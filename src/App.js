import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';

const Defaults=[
  5,
  25,
  25 * 60,
  false,
  false];

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      breakLength: Defaults[0],
      sessionLength: Defaults[1],
      currentTimeLeft: Defaults[2],
      isBreakTime: Defaults[3],
      isRunning: Defaults[4]
    }
    this.changeTimerLength = this.changeTimerLength.bind(this);
    this.tick = this.tick.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
  }

  changeTimerLength(type, ammount) {
    if(type==="Break"){
      this.setState((state, props) => {
        if((state.breakLength + ammount) <= 60 
        && (state.breakLength + ammount) > 0){
          var returner = {
            breakLength: state.breakLength + ammount
          }
          if(!state.isRunning && state.isBreakTime){
            returner.currentTimeLeft = returner.breakLength * 60
          }
          return returner;
        }
      });
    }
    else{
      this.setState((state, props) => {
        if((state.sessionLength + ammount) <= 60 
        && (state.sessionLength + ammount) > 0){
          var returner = {
            sessionLength: state.sessionLength + ammount
          }
          if(!state.isRunning && !state.isBreakTime){
            returner.currentTimeLeft = returner.sessionLength * 60
          }
          return returner;
        }
      });
    }
  }

  tick(){
    this.setState((state) => {
      var newTime = state.currentTimeLeft - 1;
      if(newTime < 0){
        this.ring();
        if(!this.state.isBreakTime){
          return{
            currentTimeLeft: state.breakLength * 60,
            isBreakTime: !state.isBreakTime
          };
        }
        else{
          return{
            currentTimeLeft: state.sessionLength * 60,
            isBreakTime: !state.isBreakTime
          };
        }
      }
      else{
        return{
          currentTimeLeft: newTime
        };
      }
    });
  }

  ring(){
    var audio = document.getElementById("beep");
    audio.play();
  }

  toggleTimer() {
    if(this.clockID != null){
      clearInterval(this.clockID);
      this.clockID = null;
    }
    else{
      this.clockID = setInterval(this.tick, 1000);
    }
    this.setState({
      isRunning: (this.clockID != null)
    })
  }

  resetTimer() {
    var audio = document.getElementById("beep");
    
    if(!audio.paused) {
      audio.pause();
    }
    audio.currentTime = 0;

    if(this.clockID != null){
      clearInterval(this.clockID);
      this.clockID = null;
    }
    this.setState({
      breakLength: Defaults[0],
      sessionLength: Defaults[1],
      currentTimeLeft: Defaults[2],
      isBreakTime: Defaults[3],
      isRunning: Defaults[4]
    });
  }

  /**Why are we still here? 
   * Just to suffer? 
   * Every night, I can feel my leg… 
   * and my arm… 
   * even my fingers. 
   * 
   * The body I’ve lost… 
   * the comrades I’ve lost… 
   * won’t stop hurting… 
   * It’s like they’re all still there. 
   * 
   * You feel it, too, don’t you?
   */

  render(){
    return (
      <div id="clock">
        <div id="clockBody">
          <section id="timerLengthSection">
            <TimerLengthDisplay 
              name="Break" 
              length={this.state.breakLength} 
              buttonClick={this.changeTimerLength}/>
            <div className="divider"></div>
            <TimerLengthDisplay 
              name="Session" 
              length={this.state.sessionLength} 
              buttonClick={this.changeTimerLength}/>
          </section>
          <section id="timerSection">
            <TimerDisplay 
              time={this.state.currentTimeLeft} 
              isBreak={this.state.isBreakTime}/>
            <TimerControls 
              play={this.toggleTimer} 
              reset={this.resetTimer} 
              isPaused={this.state.isRunning}/>
          </section>
        </div>
        <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    );
  }
}

class TimerLengthDisplay extends Component {
  render(){
    return (
      <div className="clockLength">
        <label className="cremendterLabel" id={this.props.name.toLowerCase() + "-label"}>
          {this.props.name + " Length: "}
        </label>
        <div className="cremendters">
          <Incrementer 
            name={this.props.name}
            buttonClick={this.props.buttonClick}/>
          <p className="numberDisplay" id={this.props.name.toLowerCase() + "-length"}>{this.props.length}</p>
          <Decrementer 
            name={this.props.name}
            buttonClick={this.props.buttonClick}/>
        </div>
      </div>
    );
  }
}

class Decrementer extends Component {
  render(){
    return (
      <div>
        <button 
          className="decrementer"
          id={this.props.name.toLowerCase() + "-decrement"}
          onClick={() => this.props.buttonClick(this.props.name, -1)}>
            <i className="bi bi-arrow-bar-down"></i>
        </button>
      </div>
    );
  }
}

class Incrementer extends Component {
  render(){
    return (
      <div>
        <button 
          className="incrementer"
          id={this.props.name.toLowerCase() + "-increment"} 
          onClick={() => this.props.buttonClick(this.props.name, 1)}>
            <i className="bi bi-arrow-bar-up"></i>
        </button>
      </div>
    );
  }
}

class TimerDisplay extends Component {
  formatTime(time){
    var minutes = Math.floor((time) / 60);
    var seconds = time%60;

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
  }

  render(){
    return (
      <div id="timer" >
        <h3 id="timer-label">
        {this.props.isBreak
          ? "Break"
          : "Session"}
        </h3>
        <h2 id="time-left">{this.formatTime(this.props.time)}</h2>
      </div>
    );
  }
}

class TimerControls extends Component {
  render(){
    return (
      <div id="clock-controls">
        <button 
          id="start_stop"
          onClick={() => this.props.play()}>
            {this.props.isPaused
              ? <i className="bi bi-pause-circle-fill"></i>
              : <i className="bi bi-play-circle-fill"></i>}
        </button>
        <div className="divider"></div>
        <button 
          id="reset"
          onClick={() => this.props.reset()}>
            <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </div>
    );
  }
}

export default App;