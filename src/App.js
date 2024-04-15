import React, { useState, useEffect } from "react";

// import MultipleChoiceSlide from "./Slides/MultipleChoiceSlide.js";
// import LikertScaleSlide from "./Slides/LikertSlide.js";
import NodeInputSlide from "./Slides/NodeInputSlide.js";
import NodeConnect1Slide from "./Slides/NodeConnect1Slide.js";
import LadderSlide from "./Slides/LadderSlide.js";

import NextSlideButton from "./Components/NextSlideButton.js";
import Banner from "./Components/Banner.js";
import TheSlide from "./Components/TheSlide.js";

import BannerImg from "./Images/cornell_seal_simple_web_black.svg";
import generateColors from "./Components/Helper.js";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./config/firestore.js";

import "./App.css";
import { maxIndex } from "d3";

const App = () => {
  const [selectionData, setSelectionData] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [nextBlocked, setNextBlocked] = useState(false);
  const [submittedToFirebase, setSubmittedToFirebase] = useState(false);
  const [colors, setColors] = useState();

  const MAX_NOM = 10;
  const DATA_KEYS = ['all_people', 'all_people_turn_to_you', 
  'all_people_turn_to_0',
  'all_people_turn_to_1',
  'all_people_turn_to_2',
  'all_people_turn_to_3',
  'all_people_turn_to_4',
  'all_people_turn_to_5',
  'all_people_turn_to_6',
  'all_people_turn_to_7',
  'all_people_turn_to_8',
  'all_people_turn_to_9',
  'ladder_slide',
  'survey_feedback',
]
const TOTAL_SLIDES = DATA_KEYS.length;


  useEffect(() => {
    setColors(generateColors(MAX_NOM + 1)); // 1 extra for 'you'
  }, []);

  const add_to_firebase = async (e) => {
    try {
      const docRef = await addDoc(
        collection(db, "Participant_Test"),
        selectionData
      );
      console.log("Document written with ID: ", docRef.id);
      setSubmittedToFirebase(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateCurrentSelection = (option) => {
    setNextBlocked(false);
    setCurrentSelection(option);
  };

  // const getOutputValue = (current_person) => {

  //   const size = MAX_NOM + 1;
  //   const outputData = []

  //   if (selectionData['all_people'] !== undefined){
  //     const split = selectionData['all_people'].length
  //     for (let i = 0; i < split; i++) {
  //       outputData[i] = 0;
  //     }
  //     for (let i = split; i < size; i++) {
  //       outputData[i] = -1;
  //     }
  //     outputData[current_person] = -1
    
  //     return outputData
  //   }
  //   else {
  //     return [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
  //   }

  // }

  // Function to include skipping logic for slides based on if information is inputed
  // if there are 3 people, the slides 4-9 need to be skipped 
  const updateState = () => {
    console.log("===============", slideIndex);

    const next_data_add = { ...selectionData };
    let current_slide_index = slideIndex;


    if (currentSelection === null) {
      next_data_add[DATA_KEYS[current_slide_index]] = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    } else {
      next_data_add[currentSelection.key] = currentSelection.data;
    }
    current_slide_index += 1;

    if (current_slide_index === 1 && next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 2 && next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 3 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 1) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 4 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 2) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 5 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 3) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 6 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 4) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 7 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 5) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 8 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 6) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 9 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 7) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 10 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 8) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    if (current_slide_index === 11 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11 || next_data_add['all_people'].length <= 9) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }

    if (current_slide_index === 12 && (next_data_add['all_people'].reduce((total, current) => total + current, 0) === -11) ) {
      next_data_add[DATA_KEYS[current_slide_index]] =  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
      current_slide_index += 1;
    }
    

    console.log(currentSelection);
    console.log(next_data_add);
    console.log(current_slide_index);
    setSelectionData(next_data_add);
    setSlideIndex(current_slide_index);
    setCurrentSelection(null);
  };

  const handleNextSlide = () => {
    if (currentSelection !== null) {
      updateState();
    } else {
      setNextBlocked(true);
    }
  };

  const nextBlockOverride = (tf) => {
    setNextBlocked(false);
    if (tf) {
      updateState();
    }
  };

  return (
    <div className="app-box">
      <Banner logo={BannerImg} text={"Cornell University"} />
      <TheSlide>
        {slideIndex < TOTAL_SLIDES ? (
          <>
            {/* =====================================================
          
          Slides for inputing names into different categories 
          
          =====================================================*/}
            {slideIndex === 0 && (
              <NodeInputSlide
                promptText="Some of your peers may be a safe person for you to turn to, during challenging, threatening, or uncertain times."
                promptText2="Think about any individuals who are a safe person for you to turn to when you are having a bad day or had a negative experience. Please nominate each person who comes to mind. Type in the first name of each person."
                specialInstructions="NOTE: Please add initials to duplicate names, the bar will flash if a duplicate is detected"
                maxNom={MAX_NOM}
                colors={colors}
                inlineText="Write name"
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {/* =====================================================
          
          Slides for asking which of the nominated will turn to you 
          
          =====================================================*/}
            {slideIndex === 1 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  "Which of these individuals do you think turn to you as a safe person when they are having a bad day or had a negative experience?"
                }
                maxNom={MAX_NOM}
                num_to_exclude={MAX_NOM}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}

            {/* =====================================================
          
          Slides asking who your friends turn to
          
          =====================================================*/}

            {slideIndex === 2 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[0]}</b> as a safe person when they are havslideIndex -2ng a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={0}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 3 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[1]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={1}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 4 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[2]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={2}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 5 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[3]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={3}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 6 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[4]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={4}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 7 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[5]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={5}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 8 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[6]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={6}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 9 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[7]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={7}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 10 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[8]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={8}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {slideIndex === 11 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[9]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={9}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
              />
            )}
            {/* {slideIndex === 12 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={`Which of these individuals do you think <b>${selectionData.all_people[10]}</b> as a safe person when they are having a bad day or had a negative experience?`}
                maxNom={MAX_NOM}
                num_to_exclude={10}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                id="all_people_turn_to_10"
                key="all_people_turn_to_10"
              />
            )} */}

            {/* =====================================================
          
          Ladder slides 
          
          =====================================================*/}
            {slideIndex === 12 && (
              <LadderSlide
                promptText="These are all of the individuals you nominated."
                promptText2="Please answer the following questions about each of them"
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}

              />
            )}
            {/* =====================================================
          
          Survey Feedback question
          
          =====================================================*/}
            {slideIndex === 13 && (
              <NodeInputSlide
                promptText="Thank you for completing the mockup."
                promptText2="Please add any kind of feedback"
                maxNom={100}
                inlineText="Write name"
                updateCurrentSelection={updateCurrentSelection}
                key={DATA_KEYS[slideIndex]}
                id={DATA_KEYS[slideIndex]}
                include_svg={false}
              />
            )}
            <NextSlideButton
              nextBlockOverride={nextBlockOverride}
              nextBlocked={nextBlocked}
              onClick={handleNextSlide}
            />
          </>
        ) : (
          <>
            <p style={{ marginLeft: 30 }}>All slides have been completed.</p>
            {submittedToFirebase ? (
              <p style={{ marginLeft: 30 }}>
                Thank you, you can close the tab now
              </p>
            ) : (
              <button
                style={{ borderRadius: 5, marginLeft: 30 }}
                onClick={add_to_firebase}
              >
                Click this button to submit
              </button>
            )}
            {/* <button id="test-button"
              style={{ borderRadius: 5, marginLeft: 30 }}
              onClick={handletestclick}
            >
              test button
            </button> */}
          </>
        )}
      </TheSlide>
    </div>
  );
};

export default App;

/* <NodeSelectionSlide
              nodeNames = {['0', '1', '2', '3', '4', '5']}
              updateCurrentSelection={updateCurrentSelection}
              nextBlocked = {nextBlocked}

              
            /> */
/* <NodeConnect1Slide
      promptText={"These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."}
      promptText2={"Which of these individuals do you think turn to you as a safe person when they are having a bad day or had a negative experience?"}
        nodeNames={["0", "1", "2", "3", "4", "5"]}
        updateCurrentSelection={updateCurrentSelection}
        nextBlocked={nextBlocked}
      /> */

// {slideIndex === 0 && (
//   <MultipleChoiceSlide
//    question = "What is the capital of France?"
//    options = {["Paris", "Berlin", "Madrid", "Rome"]}
//    updateSelection={updateCurrentSelection}
//   />
// )}
// {slideIndex === 1 && (
//   <MultipleChoiceSlide
//   question = "What is the capital of Japan?"
//   options = {["Tokyo", "Seoul", "Beijing", "Bangkok"]}
//     updateSelection={updateCurrentSelection}
//   />
// )}
// {slideIndex === 2 && (
//   <LikertScaleSlide
//     questions={["Hummus is good", "Bagels are good", "Tall", "Short"]} // Ensure to pass the 'question' property of the 'slide2' object
//     updateSelection={updateCurrentSelection}
//   />
// )}
// {slideIndex === 3 && (
//   <NodeInputSlide
//     promptText = "Some of your peers may be a safe person for you to turn to, during challenging, threatening, or uncertain times."
//     promptText2 = "Think about any individuals who are a safe person for you to turn to when you are having a bad day or had a negative experience. Please nominate each person who comes to mind. Type in the first name of each person."
//     maxNom = {10}
//     inlineText = "Write name"
//     updateCurrentSelection={updateCurrentSelection}
//     nextBlocked = {nextBlocked}

//   />
// )}

// {slideIndex < total_slides ? (
//   <>
//     {slideIndex === 0 && <MultipleChoiceSlide {...slide1} />}
//     <NextSlideButton onClick={handleNextSlide} />
//   </>
// ) : (<p>No more slides</p>) }

// const slide0 = {
//   question: "What is the capital of France?",
//   options: ["Paris", "Berlin", "Madrid", "Rome"],
// };
// const slide1 = {
//   question: "What is the capital of Japan?",
//   options: ["Tokyo", "Seoul", "Beijing", "Bangkok"],
// };
// const slide2 = {
//   questions: ["Hummus is good", "Bagels are good", "Tall", "Short"],
// };
// const slide3 = {
//   promptText: "Who are your closest friends?",
//   inlineText: "Write Name",
// };
// const slide4 = {
//   questions: ["Hummus is good", "Bagels are good", "Tall", "Short"],
// };
// //const data = [10, 20, 30, 40, 50];
