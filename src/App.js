import React from 'react';
import styles from './App.module.scss';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useState,useEffect} from 'react';
import ResultImg from './Assets/winners.svg';
function App() {
  const [countries,setCountries]= useState([]);
  const [question,setQuestion]= useState("");
  const [answer,setAnswer]= useState("");
  const [options,setOptions] = useState([]);
  const [mode,setMode] = useState('');
  const [count,setCount] = useState(0);
  const [next,setNext] = useState(false);
  const [showResult,setShowResult] =  useState(false);

  const loadNextQuestion = () => {
    let countrySelection=[];
    let options=[];
    for(let i=0;i<4;i++){
      countrySelection.push(countries[(Math.floor(Math.random() * countries.length))]);
    }
    let flip = Math.floor(Math.random() * Math.floor(2));
    let mode = flip === 0 ? 'capital': 'flag';
    setMode(mode); 
    if(mode === 'capital') {
      setQuestion(countrySelection[0].name);  
      setAnswer(countrySelection[0].capital);
      for(let i=0;i<4;i++){
        options.push(countrySelection[i].name);
      }
  } else {
       setQuestion(countrySelection[0].flag);
       setAnswer(countrySelection[0].name);
       for(let i=0;i<4;i++){
        options.push(countrySelection[i].name);
      }
  }
    setOptions(options);
  }

  useEffect(()=>{
    const loadQuestion =(list) => {
      let countrySelection=[];
      let options=[];
      for(let i=0;i<4;i++){
        countrySelection.push(list[(Math.floor(Math.random() * list.length))]);
      }
      let flip = Math.floor(Math.random() * Math.floor(2));
      let mode = flip === 0 ? 'capital': 'flag';
      setMode(mode);

      if(mode === 'capital') {
          setQuestion(countrySelection[0].name);  
          setAnswer(countrySelection[0].capital);
          for(let i=0;i<4;i++){
            options.push(countrySelection[i].capital);
          }
      } else {
           setQuestion(countrySelection[0].flag);
           setAnswer(countrySelection[0].name);
           for(let i=0;i<4;i++){
            options.push(countrySelection[i].name);
          }
      }
      setOptions(options);
    };
    fetch(`https://restcountries.eu/rest/v2/all?fields=name;capital;flag;`, {
      "method": "GET"
    })
      .then(response => response.json())
      .then(response => {
         setCountries(response.filter(country => country.capital!==""));
         loadQuestion(response.filter(country => country.capital!==""));
      })
      .catch(err => {
        console.log(err);
      });
  },[]);

  const getQuestionText =() => {
      return `${question} is capital of`;
  }
  const getQuestionImg = () => {
     return `${question}`;
  }
  const handleAnswer = (value) => {
     if(answer === value) {
      setCount(prevCount => prevCount + 1);
      setNext(true);
     } else {
       setNext(false);
       setShowResult(true);
     }
  }
  const tryAgain = () => {
    setCount(0);
    setShowResult(false);
  }
  return (
  <div className={styles.main}>    
      <div className={styles.quiz}>
      <h2>COUNTRY QUIZ</h2>
      {!showResult  && <div className={styles.quizarea}>
           { mode ==='capital' ?  <p> {getQuestionText()} </p> : null }
           { mode ==='flag' ? 
           <div>
           <img alt="flag" src={getQuestionImg()}></img>
           <p>Which country does this flag belong to </p> 
           </div> : null}
           <List className={styles.list}>
            
            {options.map((value, key) => {
                return (
                    <ListItem key={key} button onClick={() => handleAnswer(value)}>
                        <ListItemText  primary={value} />
                    </ListItem>

                )
            })}
            </List>
            {next && <Button onClick={()=> loadNextQuestion()}>Next</Button>}
      </div>}
      {showResult && <div className={styles.result}>
      <img src={ResultImg}></img>
      <h1>Results</h1>
      <p>You got {count} correct answers</p>
      <Button variant="outlined" onClick={()=>tryAgain()}>Try Again</Button>
      </div>}
      </div>
  </div>
  );
}
export default App;
