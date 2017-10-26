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
  getOwners();
  $('#tBody').on('click', '.updateBtn', editPet);
  $('#tBody').on('click', '.inOutBtn', checkPetIn);

}

var editing = false;
var editingId = 0;


function refreshPets() {
  console.log ('refreshing Pets');

//wait i'm suuuuuper confused, we're seeing in the console that the response is wrong -- it overwrites the pet's id with the owner's id. And yet the database looks right in Postico.....is the query wrong?? But when you run it in Postico is looks good...?! This is really strange.
  $.ajax({
    type: 'GET',
    url: '/hotel/pets',
  }).done(function(response){
    var pets = response;
    // console.log(pets);
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
    var $tr = $('<tr></tr>');
    //adding data to the row will be helpful later:
    $tr.data("pet", pet);
    var ownerName = pet.first_name + ' ' + pet.last_name;
    var petName = pet.name;
    var petBreed = pet.breed;
    var petColor = pet.color;
    var updateBtn = '<button class = "updateBtn" data-id = "' + pet.id + '">Update Pet</button>';
    var deleteBtn = '<button class = "deleteBtn" data-id = "' + pet.id + '">Delete Pet</button>';
    // var inOutBtn = '<button class = "inOutBtn" data-id = "' + pet.id + '">IN</button>';

    //conditional to determine whether inOutBtn should display IN or OUT:

    // if (pet.checked_in) {
    //
    //   inOutBtn = '<button class = "inOutBtn" data-id = "' + pet.id + '">OUT</button>';
    //   //$(this).text('OUT');
    // } else {
    //   inOutBtn = '<button class = "inOutBtn" data-id = "' + pet.id + '">IN</button>';
    // }

    //else  {
    //  $(this).text('IN');
    //}


    $tr.append('<td>' + ownerName + '</td>');
    $tr.append('<td>' + petName + '</td>');
    $tr.append('<td>' + petBreed + '</td>');
    $tr.append('<td>' + petColor + '</td>');
    $tr.append('<td>' + updateBtn + '</td>');
    $tr.append('<td>' + deleteBtn + '</td>');
    if (pet.checked_in == true) {
      $tr.append('<td><button class = "inOutBtn" data-id = "' + pet.id + '">OUT</button></td>');
    } else {
      $tr.append('<td><button class = "inOutBtn" data-id = "' + pet.id + '">IN</button>');
    }
    // $tr.append('<td>' + inOutBtn + '</td>');
    $('#tBody').append($tr);


    // $('#tBody').append('<tr> <td>' + ownerName + '</td><td>' + petName + '</td><td>' + petBreed + '</td><td>' + petColor + '</td><td>' + updateBtn + '</td><td>' + deleteBtn + '</td><td>' + inOutBtn + '</td></tr>');
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
  console.log('ownerNamesArray', ownerNamesArray);

  //loop through the array and add each name to the dropdown, giving it a sneaky secret hidden id!!!
  for (var i = 0; i < ownerNamesArray.length; i++) {
    var ownerName = ownerNamesArray[i];
    var realName = ownerName.first_name + ' ' + ownerName.last_name;
    // console.log('what is the owner name.id', ownerName.id);
    // console.log(realName);

    //option's value ends up being what is in the addPet function, $('#ownerName').val():
    $el.append($("<option value=' " + ownerName.id + "'>"+realName+"</option>"));
  }

} //end refreshOwners!!!


//needs a parameter:
function savePet(pet) {
  $.ajax({
    url: '/hotel/pets',
    type: 'POST',
    data: pet
  }).done(function (response) {
    console.log(response);
    // refreshOwners();
    refreshPets();
  }).fail(function (error) {
    console.log('error', error);
  });
}

//should also clear out fields on submit, maybe even focus:
function addPet(event) {
  console.log('addPet clicked');
  event.preventDefault();
  // our misguided attempt: var ownerIdIn = $('#ownerName').data('id');
  var ownerIdIn = $('#ownerName').val();
  console.log('owner id selected', ownerIdIn);
  // another confusion: var ownerNameIn = $('#ownerName').val();
  var petNameIn = $('#petName').val();
  var petColorIn = $('#petColor').val();
  var petBreedIn = $('#petBreed').val();

  var newPetObjectToSend = {
    // yet another confusion: ownerNameIn: ownerNameIn,
    ownerIdIn: ownerIdIn,
    petNameIn : petNameIn,
    petColorIn : petColorIn,
    petBreedIn : petBreedIn
  };
  console.log(newPetObjectToSend);
  // whoops, don't call it twice: savePet(newPetObjectToSend);
  if(editing) {
    editing = false;
    $('#addEdit').text('Add Pet');
    updatePet(newPetObjectToSend);
  } else {
    savePet(newPetObjectToSend);
  }

} //end add pets!!

//called when update button is clicked to switch into editing mode:
function editPet() {
  console.log('update clicked');
  editing = true;
  editingId = $(this).data('id');
  $('#addEdit').text("Edit Pet!!");

  //set the input fields' values to reflect pet being edited:
  var pet = $(this).closest("tr").data("pet");
  console.log(pet);
  $('#petName').val(pet.name);
  $('#petBreed').val(pet.breed);
  $('#petColor').val(pet.color);
  //should also replace drop down menu with box containing name.
}

//called when submit button is clicked in editing mode:
//Oh shit now we're running into same problem i had on weekend thing, where Edit will only work if i click submit again when it's back in add mode, and it won't alter the original. But it was just working, how did i fuck this up?
function updatePet(pet) {
  console.log(editingId);
  $.ajax({
    type: 'PUT',
    url: '/hotel/' + editingId,
    data: pet
  }).done(function(response){
    refreshPets();
  }).fail(function (error){
    alert('something went wrong');
  });

}

function deleteButton() {
  var petId = $(this).data('id');
  console.log(petId);
$.ajax( {
  url: 'hotel/' + petId,
  type: 'DELETE',
}).done(function (response){
  console.log(response);
  refreshOwners();
  refreshPets();
}).fail(function (error) {
  console.log('error', error);
});
}

//on server we will set checkedIn to TRUE and update the visits table (latter is done via post route -- almost done, just not grabbing the pet's id -- ok now done):
function checkPetIn(pet) {
  var petId = $(this).closest("tr").data("pet").id;
  console.log(petId);
  var thisPet = $(this).closest("tr").data("pet");

  $.ajax({
    type: 'POST',
    url: '/hotel/visits/',
    data: thisPet
  }).done(function(response){
    refreshPets();
  }).fail(function (error){
    alert('something went wrong');
  });


  $.ajax({
    type: 'PUT',
    url: '/hotel/pets/' + petId,
    data: thisPet
  }).done(function(response){
    refreshPets();
  }).fail(function (error){
    alert('something went wrong');
  });

//
  changeStatus();
}

function changeStatus() {

}
