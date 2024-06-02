import dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import * as XLSX from 'xlsx';
import fs from 'fs';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

console.log("Firebase config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getAllDocuments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Testing"));
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Documents retrieved:", documents);
    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

const flattenObject = (ob) => {
  const toReturn = {};

  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] === 'object' && ob[i] !== null) {
      if (Array.isArray(ob[i])) {
        toReturn[i] = JSON.stringify(ob[i]); // Convert arrays to strings
      } else {
        const flatObject = flattenObject(ob[i]);
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;
          toReturn[i + '.' + x] = flatObject[x];
        }
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

const writeDocumentsToExcel = (documents) => {
  const flattenedDocuments = documents.map(doc => flattenObject(doc));

  console.log(flattenedDocuments);

  const worksheet = XLSX.utils.json_to_sheet(flattenedDocuments);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TestingData");

  // Save to file
  XLSX.writeFile(workbook, 'TestingData.xlsx');
  console.log('Excel file has been created');
};

const run = async () => {
  const documents = await getAllDocuments();
  writeDocumentsToExcel(documents);

  // Exit the process after the file has been written
  process.exit(0);
};

// Call the function to get all documents and write to Excel
run();
