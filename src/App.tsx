import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';



interface State {
  addTarhelyNev : string;
  addTarhelyMeret : number;
  addTarhelyAr : number;

  errorMessage : string;
  deleteHelp : number;

  tarhelyek : Tarhely[];
}
interface Tarhely {
  id : number;
  nev : string; 
  meret : number;
  ar : number;
}
interface TarhelyekResponse {
  rows : Tarhely[];
}


class App extends React.Component<{}, State> {
    constructor(props: {}) {
      super(props);

      this.state = {
        tarhelyek : [],
        addTarhelyNev : "",
        addTarhelyMeret : 0,
        addTarhelyAr : 0,
        errorMessage : "",
        deleteHelp : 0
      }

    }
     loadData = async () => {
      let response = await fetch('http://localhost:3000/api/tarhely');
      let data = await response.json() as TarhelyekResponse;
      this.setState({
        tarhelyek : data.rows,
      })
    }
    componentDidMount() {
      
      this.loadData()
    }
    
    addToDB = async () => {
      const {addTarhelyNev, addTarhelyMeret, addTarhelyAr,  } = this.state
      this.setState({errorMessage : ""})
      
      if(addTarhelyNev.trim() == "") {
        this.setState({errorMessage : "nem lehet üres a név mező"})
        return 
      }
      if (addTarhelyMeret < 0 ) {
        this.setState({errorMessage : "nem lehet negatív a Méret"})
        return
      }
      if(addTarhelyMeret == null || Number.isNaN(addTarhelyMeret)) {
        this.setState({errorMessage : "A Méret mező nem maradhat üresen"})
        return
      }
      
      if (addTarhelyAr < 0 ) {
        this.setState({errorMessage : "nem lehet negatív a ár"})
        return
      }
      if(addTarhelyAr == null || Number.isNaN(addTarhelyAr)) {
        this.setState({errorMessage : "A ár mező nem maradhat üresen"})
        return
      }
      const data = {
        nev : addTarhelyNev,  
        meret : addTarhelyMeret,
        ar : addTarhelyAr
      } 
      await fetch('http://localhost:3000/api/tarhely', {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
      })
      this.setState({
        addTarhelyNev : "",
        addTarhelyMeret : 0,
        addTarhelyAr : 0,
        errorMessage : "",
      })
      await this.loadData()

    }

    deleteFromDatabase = async (id : number)  => {
      await fetch('http://localhost:3000/api/tarhely/'+ id, {
        method : 'DELETE'
      })
      this.loadData()
    }

    render() {
      const {addTarhelyNev, addTarhelyMeret, addTarhelyAr, errorMessage} = this.state
      return <div>
        <div className='container'>
          <div className='row justify-content-center' >
            <div className="col-sm-4 text-center">
                 Tárhely név :  <br />  <input type="text" value={addTarhelyNev} onChange={e => this.setState({addTarhelyNev : e.currentTarget.value})} />       
             </div>

          </div>
          <div className='row justify-content-center' >
            <div className="col-sm-4 text-center">
                Tárhely Mérete : <br /> <input type="number" min={0} value={addTarhelyMeret} onChange={e => this.setState({addTarhelyMeret : parseInt(e.currentTarget.value)})} />
            </div>

          </div>
          <div className='row justify-content-center' >
            <div className="col-sm-4 text-center"> 
              Tárhely Csomag Ár / hó : <br /> <input type="number" min={0} value={addTarhelyAr} onChange={e => this.setState({addTarhelyAr : parseInt(e.currentTarget.value)})} />
          
            </div>
          </div>
          <div className='row justify-content-center mt-3  ' >
            <div className="col text-center "> 
            <button className='btn btn-secondary ' onClick={this.addToDB}>Felvesz</button> <br />
          
            </div>
          </div>
          <div className='row justify-content-center mt-3  ' >
            <div className="col text-center "> 
            <p className='text-danger'>{errorMessage}</p>          
            </div>
          </div>
         
        </div>
        


        <div className='row'>
          {this.state.tarhelyek.map(item => (
            <div className='col-md-4'>
              <div className="card text-center">
                <div className="card-body">
                  Név: {item.nev} <br />
                  Méret: {item.meret} GB <br />
                  Ár: {item.ar} FT
                  </div>
                <div className='card-footer'>
                    <button onClick={(event) => this.deleteFromDatabase(item.id)}>Törlés</button>
                </div>
            </div>
          </div>
          ))}
          </div>
      
    
      
      </div>
    }
}

export default App;
