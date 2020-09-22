import React, { Component } from 'react';
import { ProgressBar, Button,Modal } from 'react-bootstrap';
import axios from 'axios';
import "./shop.scss";

// import DatePicker from 'react-datepicker';
// import { Dropdown } from 'react-bootstrap';

export class ShopCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate : new Date(),
      persons : [],
      categories : [],
      show: false ,
      categoryName : '',
      categoryDescription :'',
      nameError : '',
      categoryNameMal : '',
      nameMalError : ''
    }
    this.inputNameChangeHandler         = this.inputNameChangeHandler.bind(this);
    this.inputDescriptionChangeHandler  = this.inputDescriptionChangeHandler.bind(this);
    this.inputNameMalChangeHandler      = this.inputNameMalChangeHandler.bind(this);
    this.postCategories      = this.postCategories.bind(this);
  } 
  componentDidMount() {
    this.fetchUsers();
    this.fetchCategories();
  }

fetchUsers (){
  axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        const personss = res.data;
        this.setState({ persons:personss });
      })
}
fetchCategories (){
    axios.get('http://localhost:5000/ShopCategories')
        .then(res => {
          const categories = res.data;
          this.setState({ categories:categories.categories });
        })
}

postCategories (){
alert('ttt')
  var categories = {
    name : this.state.categoryName, description : this.state.categoryDescription, other_languages : {
      lang: "mal",
      name: this.state.categoryNameMal,
      description : this.state.categoryDescription
    }
  }
  axios.post('http://localhost:5000/ShopCategories',categories)
      .then(res => {
        this.fetchCategories();
        this.setState({ show: false });
  })
}
fetchLocation (){
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  var e = '';
  navigator.geolocation.getCurrentPosition(function(pos){
    var crd = pos.coords;
    console.log(pos)
    var position = [crd.latitude,crd.longitude];
    console.log('position',position)
    axios.post('http://localhost:5000/updateLocation',{position:position})
    .then(res => {
      console.log(res.data);
    })
  }, function(e){
    console.log(e);

  }, options);
}

inputNameChangeHandler(event) {
    this.setState({categoryName : event.target.value});
    if(this.state.categoryName.length < 3){
      
      this.setState({nameError : 'filed is too short'})
    } else {
      this.setState({nameError : ''})
    }

    console.log(this.state.categoryName)
}
inputDescriptionChangeHandler(event) {
  this.setState({categoryDescription : event.target.value});
}

inputNameMalChangeHandler(event) {
  this.setState({categoryNameMal : event.target.value});
}

toggleProBanner() {
  document.querySelector('.proBanner').classList.toggle("hide");
}
showModal = () => {
  this.setState({ show: true });
}

hideModal = () => {
  this.setState({ show: false });
}
 
  render () {
    return (
      <div>
        <div className="row  banner" >
          <div className="col-10">
            
              <p>Shop categories</p>
              
          </div>
          <div className="col-2" ><span className="d-flex justify-content-end" styles="{{align-self:'flex-end'}}"> <Button  variant="primary" onClick={this.showModal}>
                  Create Category <i className="fa fa-plus"></i>
              </Button></span></div>
        </div>
       
        <div className="row">
          <div className="col-lg-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Orders</h4>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> # </th>
                        <th> Category</th>
                        <th> description </th>
                        <th> Action </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.categories.map((person, index) =>{
                        return (
                      <tr>
                        <td className="font-weight-medium"> 
                          {index+1}
                        </td>
                        <td> 
                          {person.name} 
                        </td>
                        <td>
                          {person.description}
                        </td>
                        <td>
                            <button type="button" className="btn btn-outline-secondary btn-rounded btn-icon">
                              <i className="mdi mdi-pencil text-success"></i>
                            </button>
                            <button type="button" className="btn btn-outline-secondary btn-rounded btn-icon">
                              <i className="mdi mdi-delete text-danger"></i>
                            </button>
                        </td>
                      </tr>)
                      })}
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal show={this.state.show}  onHide={this.hideModal} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Shop categories</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="shopCategory">Name </label>
              <input type="text" className={this.state.nameError != ''?" form-control is-invalid":"form-control"} id="shopCategory" placeholder="Category"  onChange={ this.inputNameChangeHandler}
              autoComplete="none"></input>
              <div className="invalid-feedback" >
              {this.state.nameError}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shopCategoryMal">Name In malayalam </label>
              <input type="text" className={this.state.nameMalError != ''?" form-control is-invalid":"form-control"} id="shopCategoryMal" placeholder="Category"  onChange={ this.inputNameMalChangeHandler}
              autoComplete="none"></input>
              <div className="invalid-feedback" >
              {this.state.nameMalError}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="shopCategoryDescription">Example textarea</label>
              <textarea className="form-control" id="shopCategoryDescription" rows="3"  onChange={this.inputDescriptionChangeHandler}></textarea>
            </div>
          </form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>
              Close
            </Button>
            <Button variant="primary" onClick={ this.postCategories}>
              Save 
            </Button>
          </Modal.Footer>
        </Modal>
      </div> 
    );
  }
}




export default ShopCategory;