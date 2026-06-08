import { useEffect, useState } from "react";
import SeatPicker from "./SeatPicker";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Remember from "./assets/Remember";
import Sit from "./assets/Sit";
import Class from "./assets/Class";



function App() {



  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SeatPicker />} />
          <Route path="/sit" element={<Sit />} />
          <Route path="/class" element={<Class />} />
           <Route path="/detail/:id" element={<Remember/>} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;