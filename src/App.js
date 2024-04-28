import React, { useState, useEffect } from "react";

import MultipleChoiceSlide from "./Slides/MultipleChoiceSlide.js";
// import LikertScaleSlide from "./Slides/LikertSlide.js";
import NodeInputSlide from "./Slides/NodeInputSlide.js";
import NodeConnect1Slide from "./Slides/NodeConnect1Slide.js";
import LadderSlide from "./Slides/LadderSlide.js";

import NextSlideButton from "./Components/NextSlideButton.js";
import Banner from "./Components/Banner.js";
import TheSlide from "./Components/TheSlide.js";

// import NodeSelectionSlide from "./Archive/NodeSelectionSlide.js"

import BannerImg from "./Images/cornell_seal_simple_web_black.svg";
import generateColors from "./Components/Helper.js";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./config/firestore.js";

import "./App.css";

const App = () => {
  const [selectionData, setSelectionData] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [slideIndex, setSlideIndex] = useState(-1); // STARTING SLIDE INDEX (-1 for conset slide)
  const [nextBlocked, setNextBlocked] = useState(false);
  const [submittedToFirebase, setSubmittedToFirebase] = useState(false);
  const [colors, setColors] = useState();

  const MAX_NOM = 10;
  // const DATA_KEYS = [];
  const TOTAL_SLIDES = 14; // added 1 for demographics,
  const TESTING_MODE = true;

  useEffect(() => {
    setColors(generateColors(MAX_NOM + 1)); // 1 extra for 'you'
  }, []);

  const add_to_firebase = async (e) => {
    try {
      const docRef = await addDoc(
        collection(db, "Participant_Test"),
        selectionData
      );

      if (TESTING_MODE) {
        console.log(selectionData);
      }

      console.log("Document written with ID: ", docRef.id);
      setSubmittedToFirebase(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const updateCurrentSelectionLikertMult = (option) => {
    const next_data_add = { ...selectionData };

    next_data_add[option.key] = option.data;

    setSelectionData(next_data_add);
    // setSlideIndex(current_slide_index);
    // setCurrentSelection(null);
    console.log(next_data_add);
  };

  // Takes in whatever data, initial or user updated, and placed it inside the output 
  const updateCurrentSelection = (option) => {

    const next_data_add = { ...selectionData };
    let current_slide_index = slideIndex;

    next_data_add[option.key] = option.data;

    if (TESTING_MODE) {
      console.log(option)
      console.log(next_data_add);
      console.log(current_slide_index);
    }

    if (option.override){
      setSlideIndex(slideIndex + 1)
    }

    setCurrentSelection(option);
    setSelectionData(next_data_add);
  };

  
  const handleNextSlide = () => {
    console.log(currentSelection)
    if (slideIndex === -1 && currentSelection.data === null) {
      setSlideIndex(TOTAL_SLIDES);
      setSubmittedToFirebase(true);
    } else if (slideIndex === -1 && currentSelection.data === "no") {
      setSlideIndex(TOTAL_SLIDES);
      setSubmittedToFirebase(true);
    } else if (currentSelection.nextBlocked) {
      setNextBlocked(true)
    }
    else {
      setNextBlocked(false)
      setSlideIndex(slideIndex + 1)
    }
  };

  const nextBlockOverride = (tf) => {
    setNextBlocked(false);
    if (tf) {
      setSlideIndex(slideIndex + 1)
    }
  };

  return (
    <div className="app-box">
      <Banner logo={BannerImg} text={"Cornell University"} />
      <TheSlide>
        {/* <NodeSelectionSlide
        nodeNames={["1", "2", "3", "4", "5"]}
        updateCurrentSelection ={updateCurrentSelection}
        >
        </NodeSelectionSlide> */}
        {slideIndex < TOTAL_SLIDES ? (
          <>
            {/* =====================================================
          
          Consent
          
          =====================================================*/}

            {slideIndex === -1 && (
              <MultipleChoiceSlide
                question={"Do you consent to participating in this study?"}
                options={["yes", "no"]}
                updateCurrentSelection={updateCurrentSelection}
                key={"consent"}
                id={"consent"}
              />
            )}

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
                key={"all_people"}
                id={"all_people"}
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
                  <span>
                    Which of these individuals do you <b>you</b> turn to as a
                    safe person when they are having a bad day or had a negative
                    experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={MAX_NOM}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_you"}
                id={"all_people_turn_to_you"}
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
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[0]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={0}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_0"}
                id={"all_people_turn_to_0"}
              />
            )}
            {slideIndex === 3 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[1]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={1}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_1"}
                id={"all_people_turn_to_1"}
              />
            )}
            {slideIndex === 4 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[2]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={2}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_2"}
                id={"all_people_turn_to_2"}
              />
            )}
            {slideIndex === 5 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[3]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={3}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_3"}
                id={"all_people_turn_to_3"}
              />
            )}
            {slideIndex === 6 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[4]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={4}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_4"}
                id={"all_people_turn_to_4"}
              />
            )}
            {slideIndex === 7 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[5]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={5}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_5"}
                id={"all_people_turn_to_5"}
              />
            )}
            {slideIndex === 8 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[6]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={6}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_6"}
                id={"all_people_turn_to_6"}
              />
            )}
            {slideIndex === 9 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[7]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={7}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_7"}
                id={"all_people_turn_to_7"}
              />
            )}
            {slideIndex === 10 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[8]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={8}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_8"}
                id={"all_people_turn_to_8"}
              />
            )}
            {slideIndex === 11 && (
              <NodeConnect1Slide
                promptText={
                  "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
                }
                promptText2={
                  <span>
                    Which of these individuals do you think{" "}
                    <b>{selectionData.all_people[9]}</b> as a safe person when
                    they are having a bad day or had a negative experience?
                  </span>
                }
                maxNom={MAX_NOM}
                num_to_exclude={9}
                colors={colors}
                nodeNames={selectionData.all_people}
                updateCurrentSelection={updateCurrentSelection}
                key={"all_people_turn_to_9"}
                id={"all_people_turn_to_9"}
              />
            )}

            {/* =====================================================
          
          Ladder slides 
          
          =====================================================*/}
            {slideIndex === 12 && (
              <LadderSlide
                promptText="These are all of the individuals you nominated."
                promptText2="Please answer the following questions about each of them"
                nodeNames={[...selectionData.all_people, ...Array.from({ length: MAX_NOM - selectionData.all_people.length }, () => -1), 'You']}
                updateCurrentSelection={updateCurrentSelection}
                maxNom={MAX_NOM}
                key={"ladder_slide"}
                id={"ladder_slide"}
              />
            )}

            {/* =====================================================
          
               Demographics slides

          =====================================================*/}
            {slideIndex === -1 && (
              <div>
                {" "}
                {
                  <>
                    <MultipleChoiceSlide
                      question={"Please indicate your race/ethnicity:"}
                      options={[
                        "White",
                        "Hispanic or Latino",
                        "Black or African American",
                        "Native American or American Indian",
                        "Asian/Pacific Islander",
                      ]}
                      add_other_option={true}
                      checkbox={true}
                      updateCurrentSelection={updateCurrentSelection}
                      key={"Ethnicity"}
                      id={"Ethnicity"}
                    />
                    <MultipleChoiceSlide
                      question={"What is your gender?"}
                      options={["Man", "Woman"]}
                      add_other_option={true}
                      checkbox={false}
                      updateCurrentSelection={updateCurrentSelection}
                      key={"Gender"}
                      id={"Gender"}
                    />
                  </>
                }
              </div>
            )}

            {/* =====================================================
          
          Survey Feedback question
          
          =====================================================*/}
            {slideIndex === 14 && (
              <NodeInputSlide
                promptText="Thank you for completing the mockup."
                promptText2="Please add any kind of feedback"
                maxNom={100}
                inlineText="Write name"
                updateCurrentSelection={updateCurrentSelection}
                key={"survey_feedback"}
                id={"survey_feedback"}
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
