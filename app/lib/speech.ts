import * as Speech from "expo-speech";

export const speakMessage = (text:string) => {
  Speech.speak(text);
}

export const stopSpeech = () => {
  Speech.stop();
}