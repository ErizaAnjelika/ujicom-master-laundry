import {useRoutes} from "react-router-dom";
import { routes } from "./routes";

//Todo: use routes adlh hook dari react-router-dom, diguakan untuk mengelola bagaimana komponen ditampilkan berdasarkan route

const App =()=>{

  //Todo: menggunakan useRoutes dan memberikan daftar route. hasilnya akan disimpan didalam variabel element
  const element = useRoutes(routes);
  return element;
}

export default App