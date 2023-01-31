import clock from "clock";
import * as document from "document";
import { me as appbit } from "appbit";
import { today } from "user-activity";

// Tick every second
clock.granularity = "seconds";

const secs1 = document.getElementById("secs1");
const secs2 = document.getElementById("secs2");
const secs4 = document.getElementById("secs4");
const secs8 = document.getElementById("secs8");
const secs16 = document.getElementById("secs16");
const secs32 = document.getElementById("secs32");
const secsElementsArr = [secs1, secs2, secs4, secs8, secs16, secs32];

const mins1 = document.getElementById("mins1");
const mins2 = document.getElementById("mins2");
const mins4 = document.getElementById("mins4");
const mins8 = document.getElementById("mins8");
const mins16 = document.getElementById("mins16");
const mins32 = document.getElementById("mins32");
const minsElementsArr = [mins1, mins2, mins4, mins8, mins16, mins32];

const hrs1 = document.getElementById("hrs1");
const hrs2 = document.getElementById("hrs2");
const hrs4 = document.getElementById("hrs4");
const hrs8 = document.getElementById("hrs8");
const hrsElementsArr = [hrs1, hrs2, hrs4, hrs8];

const clockLabel = document.getElementById("clock-label");

function dec2bin(dec) {
  return (+dec)
    .toString(2) // To base 2
    .split('') // Split into elements
    .reverse() // Reverse order to make it conceptually easier
}

// Array.fill() and .padStart() don't work 😡
function padArray(arrayToPad, length, emptyValue) {
  const blank = new Array(length);

  for (const i = 0; i < blank.length; i++) {
    blank[i] = emptyValue;
  }

  return blank.map((_el, idx) => {
    if (arrayToPad[idx]) {
      return arrayToPad[idx];
    }

    return emptyValue;
  });
}

function updateLights(elementsArr, settingsArr) {
  elementsArr.forEach((el, idx) => {
    if (settingsArr[idx] === '0') {
      el.style.opacity = 0.45;
    } else {
      el.style.opacity = 1;
    }
  });
}

function updateClock(evt) {
  const secsBinArray = dec2bin(evt.date.getSeconds());
  const minsBinArray = dec2bin(evt.date.getMinutes());
  
  const hrs = evt.date.getHours();
  const fixedHrs = hrs % 12 || 12;
  const hrsBinArray = dec2bin(fixedHrs);

  const secsOut = padArray(secsBinArray, 6, '0');
  const minsOut = padArray(minsBinArray, 6, '0');
  const hrsOut = padArray(hrsBinArray, 4, '0');
  
  updateLights(secsElementsArr, secsOut);
  updateLights(minsElementsArr, minsOut);
  updateLights(hrsElementsArr, hrsOut);

  clockLabel.text = evt.date.toTimeString().slice(0, -4);
}

// Update the clock every tick event
clock.addEventListener("tick", updateClock);

if (appbit.permissions.granted("access_activity")) {
  console.log(`${today.adjusted.steps} Steps`);
  if (today.local.elevationGain !== undefined) {
    console.log(`${today.adjusted.elevationGain} Floor(s)`);
  }
}