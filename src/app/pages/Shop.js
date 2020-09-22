import React, { Component } from 'react';
import { ProgressBar, Dropdown, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import "./shop.scss";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
const appurl = 'http://18.220.248.67:5000/';

// import DatePicker from 'react-datepicker';
// import { Dropdown } from 'react-bootstrap';

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};
const styl = { banner:{ background:"#fff",padding:"10px",margin: "0px",
marginBottom: "10px"}}
export class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate : new Date(),
      persons : [],
      categories : [],
      show: false ,
      name: null,
      description: null,
      errors: {
        name: '',
        description: '',
      },
      shopCategories : [],
      address : '',

    }
    this.statusChangedHandler = this.statusChangedHandler.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.handleAddress = this.handleAddress.bind(this);
  } 
  componentDidMount() {
    this.fetchUsers();
    this.fetchCategories();
    this.fetchShopCategories();
  }
  statusChangedHandler(event, id) {
    const todo = {...this.state.todos[id]};
    todo.isCompleted = event.target.checked;

    const todos = [...this.state.todos];
    todos[id] = todo;

    this.setState({
        todos: todos
    })
}


handleAddress = address => {
  this.setState({ address });
};

handleSelect = address => {
  geocodeByAddress(address)
    .then(results => getLatLng(results[0]))
    .then(latLng => console.log('Success', latLng))
    .catch(error => console.error('Error', error));
};
fetchUsers (){
  axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then(res => {
        const personss = res.data;
        this.setState({ persons:personss });
      })
}
fetchCategories (){
    axios.get(appurl+'shope')
        .then(res => {
          const categories = res.data;
          this.setState({ categories:categories.shops });
        })
  }
fetchShopCategories (){
    axios.get(appurl+'ShopCategories')
        .then(res => {
          const categories = res.data;
          this.setState({ shopCategories:categories.categories });
        })
}
fetchLocation (){
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };
  // var e = '';
  navigator.geolocation.getCurrentPosition(function(pos){
    var crd = pos.coords;
    console.log(pos)
    var position = [crd.latitude,crd.longitude];
    console.log('position',position)
    axios.post(appurl+'updateLocation',{position:position})
    .then(res => {
      console.log(res.data);
    })
  }, function(e){
    console.log(e);

  }, options);
}

addTodo (event) {
    event.preventDefault();

    const todos = [...this.state.todos];
    todos.unshift({
        id: todos.length ? todos[todos.length - 1].id + 1 : 1,
        task: this.state.inputValue,
        isCompleted: false
        
    })

    this.setState({
        todos: todos,
        inputValue: ''
    })
}

removeTodo (index) {
    const todos = [...this.state.todos];
    todos.splice(index, 1);

    this.setState({
        todos: todos
    })
}

handleChange = (event) => {
  event.preventDefault();
  const { name, value } = event.target;
  let errors = this.state.errors;

  switch (name) {
    case 'fullName': 
      errors.fullName = 
        value.length < 5
          ? 'Full Name must be at least 5 characters long!'
          : '';
      break;
    case 'email': 
      errors.email = 
        validEmailRegex.test(value)
          ? ''
          : 'Email is not valid!';
      break;
    case 'password': 
      errors.password = 
        value.length < 8
          ? 'Password must be at least 8 characters long!'
          : '';
      break;
    default:
      break;
  }

  this.setState({errors, [name]: value});
}

inputChangeHandler(event) {
    this.setState({
        inputValue: event.target.value
    });
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
        <div className="row " style={styl.banner}>
          <div className="col-10">
            
              <p>Shop categories</p>
              
          </div>
          <div className="col-2" ><span className="d-flex justify-content-end" styles="{{align-self:'flex-end'}}"> <Button  variant="primary" onClick={this.showModal}>
                  Create shop <i className="fa fa-plus"></i>
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
                        <th> Shope name </th>
                        <th> Progress </th>
                        <th> Amount </th>
                        <th> Sales </th>
                        <th> Deadline </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.categories.map((person, index) =>{
                        return (
                      <tr key={person._id}>
                        <td className="font-weight-medium"> {index+1}</td>
                        <td> {person.name} </td>
                        <td>
                          <ProgressBar variant="success" striped now={25}/>
                        </td>
                        <td> $ 77.99 </td>
                        <td className="text-danger"> 53.64% <i className="mdi mdi-arrow-down"></i>
                        </td>
                        <td> May 15, 2015 </td>
                      </tr>)
                      })}
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={this.state.show}  onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">Name</label>
              <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"></input>
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">Phone Number</label>
              <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"></input>
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlInput1">Email address</label>
              <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"></input>
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect2">Select categories</label>
              <select multiple className="form-control" id="exampleFormControlSelect2">
              {this.state.shopCategories.map((value, index) => <option value={value._id} key={value._id}>{value.name}</option>)}
                
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1">Example textarea</label>
              <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            <div className="form-group">
            <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleAddress}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
            </div>
          </form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideModal}>
              Close
            </Button>
            <Button variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        
        
      </div> 
    );
  }
}
const ListItem = (props) => {
  return (
      <li className={(props.isCompleted ? 'completed' : null)}>
          <div className="form-check form-check-success m-0 align-items-start">
              <label htmlFor="" className="form-check-label font-weight-medium"> 
                  <input className="checkbox" type="checkbox" 
                      checked={props.isCompleted} 
                      onChange={props.changed} 
                      /> {props.children} <i className="input-helper"></i>
              </label>
          </div>
          <i className="remove mdi mdi-close-circle-outline" onClick={props.remove}></i>
      </li>
  )
};

const renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions }) => (
  <div className="autocomplete-root">
    <input {...getInputProps()} />
    <div className="autocomplete-dropdown-container">
      {suggestions.map(suggestion => (
        <div {...getSuggestionItemProps(suggestion)}>
          <span>{suggestion.description}</span>
        </div>
      ))}
    </div>
  </div>
);
export default Shop;