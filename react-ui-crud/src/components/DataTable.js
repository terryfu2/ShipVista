import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import RegistrationModal from './form/RegistrationModal';

import { USERS_API_URL } from '../constants';

var counter  = 0;
var disabled = [-1,-1,-1,-1,-1,-1];
var stop = [0,0,1,2,3,4,5];
var isStop = [-1,-1,-1,-1,-1,-1,-1];
class DataTable extends Component {
  constructor(){
    super();
    this.state = {
      isButtonDisabled:false,
      disabledButton: -1,
      plants: ["Waterable","Waterable","Waterable","Waterable","Waterable"]
    };
    this.myFunction = this.myFunction.bind(this);
  }
  // deleteItem = id => {
  //   let confirmDeletion = window.confirm('Do you really wish to delete it?');
  //   if (confirmDeletion) {
  //     fetch(`${USERS_API_URL}/${id}`, {
  //       method: 'delete',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //       .then(res => {
  //         this.props.deleteItemFromState(id);
  //       })
  //       .catch(err => console.log(err));
  //   }
  // }
  
  //function for if stop button is pressed
  stopButton(itemid,item){
    isStop[itemid+1] = itemid;
    item.document = "stopping";
    this.setState({disabledButton:-1});
  }
  //inital timer incase user does not water right away
  startWater(items){
    //if(counter == 0){
      items.map(item => (
        setTimeout(function(){
          item.document = "needs too be watered";
          this.setState({disabledButton:-1});
        }.bind(this),21600000)
      ))
      counter++;
    //}
  }

  //main driver for the water buttons
  myFunction(itemid,item){
    
    disabled[itemid+1] = itemid;
    stop[itemid+1] = -1;
    setTimeout(function(){
      //plants is now watering
      item.document = "watering";
      this.setState({disabledButton:-1});
      //check if stop button has been pressed, or count for 30 secs, not waterable
      setTimeout(function(){
        //alert("Plant " +itemid + " has been watered");

        //if stop button has been pressed, reset buttons and display, and return
        if(isStop[itemid+1]==itemid){
          stop[itemid+1] = itemid;
          isStop[itemid+1] = -1;
          item.document = "waterable";
          disabled[itemid+1] = -1;
          this.setState({disabledButton:-1});
          return;
        }
        //30 sec delay
        stop[itemid+1] = itemid;
        item.document = "watered - N/A ";
        this.setState({disabledButton:-1});
        //plant is now waterable
        setTimeout(function(){
          //alert("Plant " +itemid + " can be watered again");
          item.document = "waterable";
          disabled[itemid+1] = -1;
          this.setState({disabledButton:-1});
          //check if last water was 6 hours ago, and displays warning
          setTimeout(function(){
            item.document = "needs to be watered";
            this.setState({disabledButton:-1});
            //alert("Plant " +itemid + " hasnt been watered in 6 hours!");
          }.bind(this),21570000);//time since last water 21600000
        }.bind(this),30000);//time ro rewater 30000
      }.bind(this),10000);//time to water 10000
    }.bind(this),10);
  }
  
  render() {
    
    const items = this.props.items;
    this.startWater(items);
    return <Table striped>
      <thead className="thead-dark">
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Status</th>
          <th style={{ textAlign: "center" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {!items || items.length <= 0 ?
          <tr>
            <td colSpan="6" align="center"><b>No Plants yet</b></td>
          </tr>
          
          : items.map(item => (
            <tr key={item.id}>
              <th scope="row">
                {item.id}
              </th>
              <td>
                {item.name}
              </td>
              <td>{item.document}</td>
              <td align="center">
                <div>
                  <RegistrationModal
                    isNew={false}
                    user={item}
                    updateUserIntoState={this.props.updateState} />
                  &nbsp;&nbsp;&nbsp;
                  <Button color = "primary" onClick = {()=>this.myFunction(item.id,item)}disabled={disabled[item.id+1] === item.id}>Water</Button>
                  <Button color = "danger" onClick = {()=>this.stopButton(item.id,item)}disabled={stop[item.id+1] === item.id}>Stop</Button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </Table>;
  }
}

export default DataTable;
