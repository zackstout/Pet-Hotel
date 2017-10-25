console.log('js');

$(document).ready(readyNow);

function readyNow() {
  console.log('jq');

$('form').on('submit', function (event){
  event.preventDefault();
  registerOwner();
}); // prevents automatic refresh due to form and calls register function
$('#addPetBtn').on('click', addPet); // calls addPet function

}

function refreshPets() {
  console.log ('refreshing Pets');

  $.ajax({
    type: 'GET',
    url: '/pets',
  }).done(function(response){
    console.log(response);
    var pets = response;
    console.log(pets);
    appendToDom(pets);
  }).fail(function (error){
    alert('something went wrong');
  });
} // end refreshPets function

function registerOwner() {
  console.log('registerOwner clicked');
  var firstNameIn = $('#firstName').val();
  var lastNameIn = $('#lastName').val();

  var ownerObjectToSend = {
    first_name: firstNameIn,
    last_name: lastNameIn
  };
   $.ajax({
      url: '/pets',
      type: 'POST',
      data: ownerObjectToSend
   }).done(function (response) {
  //  refreshOwners();
   }).fail(function (error) {
     console.log('error', error);
   });
}  // end registerOwner function

function getOwners() {
  $.ajax({
    type: 'GET',
    url: '/owners',
  }).done(function(response){
    var owners = response;
    refreshOwners(owners);
  }).fail(function (error){
    alert('Something appears to be in error');
  });
}
function refreshOwners(ownerNamesArray) {
$('#ownerName').empty();
for (var i = 0; i < ownerNamesArray.length; i++) {
  ownerName = ownerNamesArray[i];
  var $option = $(<option></option>);
  $option.append(ownerName.firstName + ownerName.lastName);//?????

}

}

function addPet() {
  console.log('addPet clicked');
  var ownerNameIn = o
  var petNameIn = $('#petName').val();
  var petColorIn = $('#petColor').val();
  var petBreedIn = $('#petBreed').val();

  var newPetObjectToSend = {
    
    
  }
}