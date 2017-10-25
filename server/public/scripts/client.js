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
  $('#tBody').on('click', '.deleteBtn', deleteButton);
  refreshPets();

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
    getOwners();
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
  // console.log('ownerNamesArray', ownerNamesArray);

  //loop through the array and pull out each name, saving it to the object
  for (var i = 0; i < ownerNamesArray.length; i++) {
    var ownerName = ownerNamesArray[i];
    var realName = ownerName.first_name + ownerName.last_name;
    console.log(realName);
    object2[i] = realName;
  }

  

  //loop through the properties of your object and update the dropdown menu
  $.each(object2, function(key,value) {
    $el.append($("<option></option>")
    .data("id", key)
    .attr("value", value).text(value));
  });

} //end refreshOwners!!!

function addPet(event) {
  console.log('addPet clicked');
  event.preventDefault();
  // var ownerNameIn = $('#ownerName option:selected');
  var petNameIn = $('#petName').val();
  var petColorIn = $('#petColor').val();
  var petBreedIn = $('#petBreed').val();

  var newPetObjectToSend = {
    // ownerNameIn: ownerNameIn,
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
    refreshOwners();
  }).fail(function (error) {
    console.log('error', error);
  });

}

function deleteButton() {
  var petId = $(this).data('id');
  console.log(petId);
$.ajax( {
  url: 'hotel/pets/' + petId, 
  type: 'DELETE',
}).done(function (response){
  console.log(response);
  refreshOwners();
  refreshPets();
}).fail(function (error) {
  console.log('error', error);
});
}

