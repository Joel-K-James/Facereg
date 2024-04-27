from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import os
from os import listdir
from PIL import Image
from numpy import asarray, expand_dims
from keras_facenet import FaceNet
import pickle
import cv2
import numpy as np
import requests
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, storage

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("C:/Users/LENOVO/Desktop/Facereg/backend/seccode.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'vc-project-ff865.appspot.com'})
bucket = storage.bucket()

# Initialize HaarCascade and FaceNet
HaarCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
MyFaceNet = FaceNet()

database = {}

@app.route('/download_images', methods=['POST', 'GET'])
def download_images():
    if request.method == 'POST':
        try:
            
            storage_folder_path = "photos"  

            
            local_download_dir = "images"  

           
            os.makedirs(local_download_dir, exist_ok=True)

           
            blobs = bucket.list_blobs(prefix=storage_folder_path)

           
            expiration_time = datetime.utcnow() + timedelta(minutes=10)

            
            for blob in blobs:
                
                download_url = blob.generate_signed_url(expiration=expiration_time)

                
                filename = os.path.basename(blob.name)

               
                filename_without_extension = os.path.splitext(filename)[0]
                subdirectory_path = os.path.join(local_download_dir, filename_without_extension)
                os.makedirs(subdirectory_path, exist_ok=True)

                
                file_path = os.path.join(subdirectory_path, filename)
                response = requests.get(download_url)
                if response.status_code == 200:
                    with open(file_path, 'wb') as f:
                        f.write(response.content)
                    print(f"File '{filename}' downloaded and saved successfully.")
                else:
                    print(f"Failed to download file '{filename}'. Status code: {response.status_code}")
                    return jsonify({'error': f"Failed to download file '{filename}'. Status code: {response.status_code}"}), 500

            return jsonify({'message': 'Images downloaded successfully'}), 200
        except Exception as e:
            print(f"An error occurred: {e}")
            return jsonify({'error': str(e)}), 500
    elif request.method == 'GET':
        return jsonify({'error': 'GET method not allowed for this endpoint'}), 405

@app.route('/process_images', methods=['POST'])
def process_images():
    data = request.get_json()

    folder = data.get('folder', 'images/')
    HaarCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    MyFaceNet = FaceNet()
    global database
    database = {}

    for person_folder in listdir(folder):
        person_folder_path = os.path.join(folder, person_folder)
        person_embeddings = []

        for filename in listdir(person_folder_path):
            path = os.path.join(person_folder_path, filename)
            gbr1 = cv2.imread(path)

            wajah = HaarCascade.detectMultiScale(gbr1, 1.1, 4)

            if len(wajah) > 0:
                x1, y1, width, height = wajah[0]
            else:
                x1, y1, width, height = 1, 1, 10, 10

            x1, y1 = abs(x1), abs(y1)
            x2, y2 = x1 + width, y1 + height

            gbr = cv2.cvtColor(gbr1, cv2.COLOR_BGR2RGB)
            gbr = Image.fromarray(gbr)
            gbr_array = asarray(gbr)

            face = gbr_array[y1:y2, x1:x2]

            face = Image.fromarray(face)
            face = face.resize((160, 160))
            face = asarray(face)

            face = expand_dims(face, axis=0)
            signature = MyFaceNet.embeddings(face)

            person_embeddings.append(signature)

        average_embedding = sum(person_embeddings) / len(person_embeddings)

        database[person_folder] = average_embedding

    with open("data.pkl", "wb") as myfile:
        pickle.dump(database, myfile)

    return jsonify({'message': 'Images processed and database saved.'})

@app.route('/video_feed', methods=['GET'])
def video_feed():
    cap = cv2.VideoCapture(0)

    def generate_frames():
        global database
        while True:
            # Capture a frame from the webcam
            ret, gbr1 = cap.read()
            if not ret:
                break

            # Convert the frame to RGB color space
            frame_rgb = cv2.cvtColor(gbr1, cv2.COLOR_BGR2RGB)

            # Detect faces in the frame
            wajah = HaarCascade.detectMultiScale(frame_rgb, 1.1, 4)

            # Iterate over detected faces
            for (x, y, w, h) in wajah:
                # Extract the face region
                face = frame_rgb[y:y+h, x:x+w]

                # Resize the face image to match the input size of FaceNet
                face_resized = cv2.resize(face, (160, 160))

                # Convert the face image to an array and add a batch dimension
                face_array = np.expand_dims(face_resized, axis=0)

                # Get the embedding of the face using FaceNet model
                face_embedding = MyFaceNet.embeddings(face_array)

                min_dist = 100
                identity = ' '

                # Compare the embedding of the detected face with embeddings in the database
                for key, value in database.items():
                    dist = np.linalg.norm(value - face_embedding)
                    if dist < min_dist:
                        min_dist = dist
                        identity = key

                # If the minimum distance is greater than 0.9, the face is unknown
                if min_dist > 0.9:
                    identity = 'unknown'

                # Draw bounding box and display identity
                cv2.putText(gbr1, identity, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                cv2.rectangle(gbr1, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Encode the frame to JPEG format
            ret, buffer = cv2.imencode('.jpg', gbr1)
            frame = buffer.tobytes()

            # Yield the frame as bytes
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=8000)


