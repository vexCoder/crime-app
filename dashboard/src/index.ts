import ReactDOM from "react-dom";
import App from "./App";
import MapboxGL from 'mapbox-gl';
import { config } from "./utils/env";
MapboxGL.accessToken = config().mapbox.key;

ReactDOM.render(App, document.getElementById("root"));
