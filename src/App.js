import React, { useState } from "react";

import MultipleChoiceSlide from "./Slides/MultipleChoiceSlide.js";
import LikertScaleSlide from "./Slides/LikertSlide.js";
import NodeInputSlide from "./Slides/NodeInputSlide.js";
import NodeConnectionSlide from "./Slides/NodeSelectionSlide.js";
import NodeConnect1Slide from "./Slides/NodeConnect1Slide.js";

import NextSlideButton from "./Components/NextSlideButton.js";
import Banner from "./Components/Banner.js";
import BannerImg from "./Images/cornell_seal_simple_web_b31b1b.svg";

import { collection, addDoc } from "firebase/firestore";
import { db } from "./config/firestore.js";

const App = () => {
  const [selectionData, setSelectionData] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [nextBlocked, setNextBlocked] = useState(false);

  const add_to_firebase = async (e) => {
    console.log({
      safe_persons: selectionData[0],
      close_proximity: selectionData[1],
      sense_of_security: selectionData[2],
      anxious_or_distressed: selectionData[3],
      good_happened: selectionData[4],
      bad_happened: selectionData[5],
      safe_to_you: selectionData[6],
      close_proximity_to_you: selectionData[7],
      sense_of_security_to_you: selectionData[8],
      anxious_or_distressed_to_you: selectionData[9],
      good_happened_to_you: selectionData[10],
      bad_happened_to_you: selectionData[11],
      all_people: selectionData[12],
      all_people_network: selectionData[13].map(
        (item) => `(${item[0]},${item[1]})`
      ),
      survey_feedback: selectionData[14],
    });
    try {
      const docRef = await addDoc(collection(db, "Participant_Response"), {
        safe_persons: selectionData[0],
        close_proximity: selectionData[1],
        sense_of_security: selectionData[2],
        anxious_or_distressed: selectionData[3],
        good_happened: selectionData[4],
        bad_happened: selectionData[5],
        safe_to_you: selectionData[6],
        close_proximity_to_you: selectionData[7],
        sense_of_security_to_you: selectionData[8],
        anxious_or_distressed_to_you: selectionData[9],
        good_happened_to_you: selectionData[10],
        bad_happened_to_you: selectionData[11],
        all_people: selectionData[12],
        all_people_network: selectionData[13].map(
          (item) => `(${item[0]},${item[1]})`
        ),
        survey_feedback: selectionData[14],
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const total_slides = 14;

  const saveSelectionData = () => {
    console.log(slideIndex);

    if (slideIndex === 11) {
      // This data needs to be saved manually before the every nominated person slide
      const no_dup = [
        ...new Set(
          selectionData[0].concat(
            selectionData[1],
            selectionData[2],
            selectionData[3],
            selectionData[4],
            selectionData[5]
          )
        ),
      ];

      setSelectionData([...selectionData, currentSelection, no_dup]);
      console.log([...selectionData, currentSelection, no_dup]);
    } else {
      setSelectionData([...selectionData, currentSelection]);
      console.log([...selectionData, currentSelection]);
    }

    console.log(slideIndex, total_slides, slideIndex === total_slides);
    if (slideIndex === total_slides) {
      console.log("proc");
      add_to_firebase();
    }
  };

  const updateCurrentSelection = (option) => {
    setCurrentSelection(option);
    // console.log(option)
  };

  const handleNextSlide = () => {
    if (slideIndex === total_slides - 1) {
      setSlideIndex(slideIndex + 1);
      saveSelectionData();
    } else if (
      slideIndex === 6 ||
      slideIndex === 7 ||
      slideIndex === 8 ||
      slideIndex === 9 ||
      slideIndex === 10 ||
      slideIndex === 11
    ) {
      console.log(currentSelection);
      setSlideIndex(slideIndex + 1);
      saveSelectionData();
      setCurrentSelection(null);
    } else if (currentSelection !== null) {
      console.log(currentSelection);
      setSlideIndex(slideIndex + 1);
      saveSelectionData();
      setCurrentSelection(null);
    } else {
      setNextBlocked(true);
      setTimeout(() => setNextBlocked(false), 1000); // Turn off flashing after 0.5s
    }
  };

  // const concatAll = () => {
  //   const no_dup = [...new Set(selectionData[0].concat(
  //     selectionData[1],
  //     selectionData[2],
  //     selectionData[3],
  //     selectionData[4],
  //     selectionData[5]
  //   ))]

  //   setSelectionData([...selectionData, no_dup]);
  //   return no_dup
  // }

  return (
    <div>
      <Banner logo={BannerImg} text={"Cornell University"} />
      {/* <NodeConnectionSlide
              nodeNames = {['0', '1', '2', '3', '4', '5']}
              updateCurrentSelection={updateCurrentSelection}
              nextBlocked = {nextBlocked}

              
            /> */}
      {/* <NodeConnect1Slide
      promptText={"These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."}
      promptText2={"Which of these individuals do you think turn to you as a safe person when they are having a bad day or had a negative experience?"}
        nodeNames={["0", "1", "2", "3", "4", "5"]}
        updateCurrentSelection={updateCurrentSelection}
        nextBlocked={nextBlocked}
      /> */}
      {slideIndex < total_slides ? (
        <>
          {/* =====================================================
          
          Slides for inputing names into different categories 
          
          =====================================================*/}
          {slideIndex === 0 && (
            <NodeInputSlide
              promptText="Some of your peers may be a safe person for you to turn to, during challenging, threatening, or uncertain times."
              promptText2="Think about any individuals who are a safe person for you to turn to when you are having a bad day or had a negative experience. Please nominate each person who comes to mind. Type in the first name of each person."
              maxNom={10}
              inlineText="Write name"
              updateCurrentSelection={updateCurrentSelection}
              id="safe_persons"
            />
          )}
          {slideIndex === 1 && (
            <NodeInputSlide
              promptText="Some of your peers may be someone you want to stay in close proximity to, perhaps living near them or sticking by them at a social event or in class."
              promptText2="Think about any individuals you like staying within close proximity to. Please nominate each person who comes to mind. Type in the first name of each person."
              maxNom={10}
              inlineText="Write name"
              updateCurrentSelection={updateCurrentSelection}
              id="close_proximity"
            />
          )}
          {slideIndex === 2 && (
            <NodeInputSlide
              promptText="Some of your peers may be someone who provides you with a sense of security, which then allows you to explore and more open to new experiences."
              promptText2="Think about any individuals who provide you with this sense of security. Please nominate each person who comes to mind. Type in the first name of each person."
              maxNom={10}
              inlineText="Write name"
              updateCurrentSelection={updateCurrentSelection}
              id="sense_of_security"
            />
          )}
          {slideIndex === 3 && (
            <NodeInputSlide
              promptText="Some of your peers may be someone whom when they are not with you or when you are separated from them, you feel anxious or distressed."
              promptText2="Think about any individuals whom you feel anxious or distressed when separate from them. Please nominate each person who comes to mind. Type in the first name of each person."
              maxNom={10}
              inlineText="Write name"
              updateCurrentSelection={updateCurrentSelection}
              id="anxious_or_distressed"
            />
          )}
          {slideIndex === 4 && (
            <NodeInputSlide
              promptText="If something good happened to you that you wanted to share with someone or just wanted to spend time with someone, who would you reach out to?"
              promptText2="Please nominate each person who comes to mind. Type in the first name of each person."
              maxNom={10}
              inlineText="Write name"
              updateCurrentSelection={updateCurrentSelection}
              id="good_happened"
            />
          )}
          {slideIndex === 5 && (
            <NodeInputSlide
              promptText="If something bad happened to you that you wanted to share with someone or just wanted to spend time with someone, who would you reach out to?"
              promptText2="Please nominate each person who comes to mind. Type in the first name of each person."
              maxNom={10}
              inlineText="Write name"
              updateCurrentSelection={updateCurrentSelection}
              id="bad_happened"
            />
          )}
          {/* =====================================================
          
          Slides for asking which of the nominated will turn to you 
          
          =====================================================*/}
          {slideIndex === 6 && (
            <NodeConnect1Slide
              promptText={
                "These are the individual(s) you nominated as a safe person for you to turn to when you are having a bad day or had a negative experience."
              }
              promptText2={
                "Which of these individuals do you think turn to you as a safe person when they are having a bad day or had a negative experience?"
              }
              nodeNames={selectionData[0]}
              updateCurrentSelection={updateCurrentSelection}
              id="safe_to_you"
            />
          )}
          {slideIndex === 7 && (
            <NodeConnect1Slide
              promptText={
                "These are the individual(s) you nominated as whom you feel anxious or distressed when separate from them."
              }
              promptText2={
                "Which of these individuals do you think consider you as someone whom they would feel anxious or distressed if separated from?"
              }
              nodeNames={selectionData[1]}
              updateCurrentSelection={updateCurrentSelection}
              id="close_proximity_to_you"
            />
          )}
          {slideIndex === 8 && (
            <NodeConnect1Slide
              promptText={
                "These are the individual(s) you nominated as whom you would like to stay in close proximity to, living near or sticking by during social events."
              }
              promptText2={
                "Which of these individuals do you think consider you as someone whom they would like to stay in close proximity to?"
              }
              nodeNames={selectionData[2]}
              updateCurrentSelection={updateCurrentSelection}
              id="sense_of_security_to_you"
            />
          )}
          {slideIndex === 9 && (
            <NodeConnect1Slide
              promptText={
                "These are the individual(s) you nominated as someone who provides you with a sense of security, which then allows you to explore and more open to new experiences."
              }
              promptText2={
                "Which of these individuals do you think consider you as someone who provides them with a sense of security?"
              }
              nodeNames={selectionData[3]}
              updateCurrentSelection={updateCurrentSelection}
              id="anxious_or_distressed_to_you"
            />
          )}
          {slideIndex === 10 && (
            <NodeConnect1Slide
              promptText={
                "These are the individual(s) you nominated as someone you would like to tell or spend time with when something good happens to you."
              }
              promptText2={
                "Which of these individuals do you think consider you as someone they would want to talk to or spend time with when something bad happens to them?"
              }
              nodeNames={selectionData[4]}
              updateCurrentSelection={updateCurrentSelection}
              id="good_happened_to_you"
            />
          )}
          {slideIndex === 11 && (
            <NodeConnect1Slide
              promptText={
                "These are the individual(s) you nominated as someone you would like to tell or spend time with when something bad happens to you."
              }
              promptText2={
                "Which of these individuals do you think consider you as someone they would want to talk to or spend time with when something good happens to them?"
              }
              nodeNames={selectionData[5]}
              updateCurrentSelection={updateCurrentSelection}
              id="bad_happened_to_you"
            />
          )}
          {/* =====================================================
          
          Slide for connecting who knows each other out of all inputed names
          
          =====================================================*/}
          {slideIndex === 12 && (
            <NodeConnectionSlide
              promptText={"These are all of the individuals you nominated."}
              promptText2={
                "Which of these individuals know each other? Draw a line between all individuals who know each other."
              }
              nodeNames={selectionData[12]}
              updateCurrentSelection={updateCurrentSelection}
              id="all_people"
            />
          )}
          {/* =====================================================
          
          Slides asking who knows each other 
          
          =====================================================*/}
          {slideIndex === 13 && (
            <NodeInputSlide
              promptText="Thank you for completing the mockup."
              promptText2="Please add any kind of feedback"
              maxNom={100}
              inlineText="Write name"
              updateCurrentSelection={updateCurrentSelection}
              id="survey_feedback"
            />
          )}
        </>
      ) : (
        <>
          <p style={{ marginTop: 100 }}>
            All slides have been completed. Please hit next slide one more time
            to submit your survey
          </p>
          {/* <div>
            <h2>Selection Data:</h2>
            <ul>
              {selectionData.map((data, index) => (
                <li key={index}>{data}</li>
              ))}
            </ul>
          </div> */}
        </>
      )}
      <NextSlideButton nextBlocked={nextBlocked} onClick={handleNextSlide} />
    </div>
  );
};

export default App;

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
