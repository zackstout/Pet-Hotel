console.log('js');

$(document).ready(readyNow);

function readyNow() {
  console.log('jq');
  // //
  // $('form').on('submit', function (event){
  //   event.preventDefault();
  //   registerOwner();
  // }); // prevents automatic refresh due to form and calls register function
  $('#addPetBtn').on('click', addPet); // calls addPet function
  $('#regBtn').on('click', registerOwner);
  refreshPets();
  getOwners();

}

function refreshPets() {
  console.log ('refreshing Pets');

  $.ajax({
    type: 'GET',
    url: '/hotel/pets',
  }).done(function(response){
    console.log(response);
    var pets = response;
    console.log(pets);
    appendToDom(pets);
  }).fail(function (error){
    alert('something went wrong');
  });
} // end refreshPets function


function appendToDom(array) {
  console.log('appending', array);
  $('#tBody').empty();

  for (var i = 0; i < array.length; i++) {
    var pet = array[i];
    var $tr = '<tr></tr>';
    var ownerName = pet.first_name + pet.last_name;
    var petName = pet.name;
    var petBreed = pet.breed;
    var petColor = pet.color;
    var updateBtn = '<button class = "updateBtn" data-id = "' + pet.id + '">Update Pet</button>';
    var deleteBtn = '<button class = "deleteBtn" data-id = "' + pet.id + '">Delete Pet</button>';
    var inOutBtn = '<button class = "inBtn" data-id = "' + pet.id + '">Out</button>';
    // $tr.append('<td>' + ownerName + '</td>');
    // $tr.append('<td>' + petName + '</td>');
    // $tr.append('<td>' + petBreed + '</td>');
    // $tr.append('<td>' + petColor + '</td>');
    // $tr.append('<td>' + updateBtn + '</td>');
    // $tr.append('<td>' + deleteBtn + '</td>');
    // $tr.append('<td>' + inOutBtn + '</td>');
    // $('#tBody').append($tr);

    $('#tBody').append('<tr> <td>' + ownerName + '</td><td>' + petName + '</td><td>' + petBreed + '</td><td>' + petColor + '</td><td>' + updateBtn + '</td><td>' + deleteBtn + '</td><td>' + inOutBtn + '</td></tr>');
  }
}

function registerOwner(event) {
  console.log('registerOwner clicked');
  event.preventDefault();
  var firstNameIn = $('#firstName').val();
  var lastNameIn = $('#lastName').val();

  var ownerObjectToSend = {
    first_name: firstNameIn,
    last_name: lastNameIn
  };
  $.ajax({
    url: '/hotel/owners',
    type: 'POST',
    data: ownerObjectToSend
  }).done(function (response) {
    getOwners(response);
  }).fail(function (error) {
    console.log('error', error);
  });
}  // end registerOwner function

function getOwners() {
  $.ajax({
    type: 'GET',
    url: '/hotel/owners',
  }).done(function(response){
    var owners = response;
    // console.log("in getOwners", owners);
    console.log(response);
    refreshOwners(owners);
  }).fail(function (error){
    alert('Something appears to be in error');
  });
} //end getOwners!!

function refreshOwners(ownerNamesArray) {
  var $el = $('#ownerName');
  //empty out the dropdown menu
  $el.empty();
  //pick each element of the names array
  var object = ownerNamesArray[i];
  //create an empty object to store each name
  var object2 = {};
  console.log('ownerNamesArray', ownerNamesArray);

  //loop through the array and pull out each name, saving it to the object
  for (var i = 0; i < ownerNamesArray.length; i++) {
    var ownerName = ownerNamesArray[i];
    var realName = ownerName.first_name + ownerName.last_name;
    console.log('what is the owner name.id', ownerName.id);
    console.log(realName);
    object2[i] = realName;
    //option's value ends up being what is in the line 135, the .val()
    $el.append($("<option value=' " + ownerName.id + "'>"+realName+"</option>"));

  }

  console.log(object2);

  //loop through the properties of your object and update the dropdown menu
  // $.each(object2, function(key,value) {
  //   $el.append($("<option value=' " + ownerName.id + "'></option>")
  //   .data("id", key)
  //   .attr("value", value).text(value));
  // });

} //end refreshOwners!!!

function addPet(event) {
  console.log('addPet clicked');
  event.preventDefault();
  // var ownerIdIn = $('#ownerName').data('id');
  var ownerIdIn = $('#ownerName').val();
  console.log('owner id selected', ownerIdIn);
  // var ownerNameIn = $('#ownerName').val();
  var petNameIn = $('#petName').val();
  var petColorIn = $('#petColor').val();
  var petBreedIn = $('#petBreed').val();

  var newPetObjectToSend = {
    // ownerNameIn: ownerNameIn,
    ownerIdIn: ownerIdIn,
    petNameIn : petNameIn,
    petColorIn : petColorIn,
    petBreedIn : petBreedIn
  };
  console.log(newPetObjectToSend);
  $.ajax({
    url: '/hotel/pets',
    type: 'POST',
    data: newPetObjectToSend
  }).done(function (response) {
    console.log(response);
    // refreshOwners();
    refreshPets();
  }).fail(function (error) {
    console.log('error', error);
  });

} //end add pets!!
