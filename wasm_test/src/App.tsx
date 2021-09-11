import React,{useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  useEffect( ()=>{
    let f = async ()=>{
      try{
        const wasm = await import('rust_to_typescript_test')
        console.log(wasm.simple_test())
        const dash = wasm.create_dashboard();
        console.log("dash is ",dash)
        console.log("dash is valid ", dash.is_valid())

        const another_dash = wasm.Dashboard.from_js({
          name: "test",
          created_at: new Date(),
          sections: [{
            name: 'Test Section',
            order: 1,
            panes: [{
              Map:{
                position: {
                  width: 100,
                  height: 100,
                  layer: 1,
                  float: false
                },
                inital_lng_lat: {
                  lat:-1000,
                  lng:0
                }
              }
            }]
          }]
        }) 
        console.log("another dash valid ", another_dash.is_valid())
        debugger

      }
      catch(err){
        console.log("unexpected error in load wasm ", err)
      }
    };
    f()
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
