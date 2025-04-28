// Get elements
const moodSelect = document.getElementById('mood-select');
const submitButton = document.getElementById('submit-mood');
const moodList = document.getElementById('mood-list');

// Add mood under the corresponding date
function addMoodToDate(mood,date,time){
    //Check if a div for this already exists
    const dateId = sanitizeDateId(date);
    let dateSection = document.getElementById(`date-${dateId}`);
    console.log('is there a date?: ',dateSection);
    
    if (!dateSection){
        // Create a new section
        dateSection = document.createElement('div');
        dateSection.id = `date-${dateId}`;

        const dateHeader = document.createElement('h3');
        dateHeader.textContent = date;
        dateSection.appendChild(dateHeader);

        const moodListforDate = document.createElement('ul');
        moodListforDate.classList.add('mood-list');
        dateSection.appendChild(moodListforDate);
        
        moodList.appendChild(dateSection);
    }
    const moodListforDate = dateSection.querySelector('ul');
    const moodItem = document.createElement('li');
    moodItem.textContent = `${mood} (${time})`;
    moodListforDate.appendChild(moodItem);
}

// Format date
function formatDate(date){
    const options = {year: 'numeric', month:'long', day:'numeric'};
    return date.toLocaleDateString('en-US',options);
}

function sanitizeDateId(dateString){
    return dateString.replace(/\s+/g,'-'); //replace space w dashes
}

function formatTime(date){
    const options = {hour: '2-digit', minute: '2-digit',second:'2-digit'};
    return date.toLocaleTimeString('en-US',options);
}

function loadMoods(){
    fetch('http://localhost:3000/moods')
        .then(response => response.json())
        .then(moodData => {
            for(const [date,moods,time] of Object.entries(moodData)){
                // Add moods for this date
                moods.forEach(moodEntry=> {
                    addMoodToDate(moodEntry.mood,date, moodEntry.time); //Add each mood to the list
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
        const formattedTime = formatTime(currentDate); //Format time
        // Add mood to list and to backend
        addMoodToDate(selectedMood,formattedDate,formattedTime);

        // Send mood to the server
        console.log('Submitting mood with date:',formattedDate)
        fetch('http://localhost:3000/moods', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mood: selectedMood,
                date: formattedDate,
                time: formattedTime
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
window.onload = loadMoods;