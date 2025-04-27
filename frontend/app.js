// Get elements
const moodSelect = document.getElementById('mood-select');
const submitButton = document.getElementById('submit-mood');
const moodList = document.getElementById('mood-list');

// Add mood to list 
function addMood(mood){
    const moodItem = document.createElement('li');
    moodItem.textContent = mood;
    moodList.appendChild(moodItem)
}

function loadMoods(){
    fetch('http://localhost:3000/moods')
        .then(response => response.json())
        .then(moods => {
            moods.forEach(mood=> {
                addMood(mood); //Add each mood to the list
            });
        })
        .catch(error=>console.error('Error fetching moods:',error));

}
// Handle mood select button
submitButton.addEventListener('click',function(){
    const selectedMood = moodSelect.value;
    if (selectedMood){
        addMood(selectedMood);
        // Send mood to the server
        fetch('http://localhost:3000/moods', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({mood:selectedMood})
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); //Mood saved with me
        });
        moodSelect.value = "";
    } else {
        alert("Please select a mood");
    }
});

// Call loadMoods on page load
window.onload = loadMoods;