// Get elements
const moodSelect = document.getElementById('mood-select');
const submitButton = document.getElementById('submit-mood');
const moodList = document.getElementById('mood-list');

// Add mood under the corresponding date
function addMoodToDate(mood,date){
    const moodItem = document.createElement('li');
    moodItem.textContent = mood;
    moodList.appendChild(moodItem);
}

// Format date
function formatDate(date){
    const options = {year: 'numeric', month:'long', day:'numeric'};
    return date.toLocaleDateString('en-US',options);
}

function loadMoods(){
    fetch('http://localhost:3000/moods')
        .then(response => response.json())
        .then(moodData => {
            for(const [date,moods] of Object.entries(moodData)){
                // Add date header
                const dateHeader = document.createElement('h3');
                dateHeader.textContent = date;
                moodList.appendChild(dateHeader);

                // Add moods for this date
                moods.forEach(mood=> {
                    addMoodToDate(mood,date); //Add each mood to the list
                });
            }
        })
        .catch(error=>console.error('Error fetching moods:',error));

}
// Handle mood select button
submitButton.addEventListener('click',function(){
    const selectedMood = moodSelect.value;
    if (selectedMood){
        const currentDate = new Date(); //Get the current date
        const formattedDate = formatDate(currentDate); //Format date

        // Add mood to list and to backend
        addMoodToDate(selectedMood,formattedDate);

        // Send mood to the server
        console.log('Submitting mood with date:',formattedDate)
        fetch('http://localhost:3000/moods', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mood: selectedMood,
                date: formattedDate
            })
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
window.onload = loadMoods();