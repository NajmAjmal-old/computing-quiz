// Function to fetch JSON data from the file
async function fetchJSON() {
    try {
        const response = await fetch('gcse-p1.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching JSON:', error);
        return null;
    }
}

// Function to create and populate HTML elements from JSON data
function populateTopics(data) {
    const container = document.querySelector('.container'); // Select the container

    if (data && data.topics) {
        data.topics.forEach(topic => {
            const topicDiv = document.createElement('div');
            topicDiv.classList.add('topic');
            topicDiv.innerHTML = `<h2>${topic.title}</h2>`;

            if (topic.subtopics) {
                topic.subtopics.forEach(subtopic => {
                    const subtopicDiv = document.createElement('div');
                    subtopicDiv.innerHTML = `<h3>${subtopic.title}</h3>`;
                    subtopic.details.forEach(detail => {
                        subtopicDiv.innerHTML += `<p>${detail}</p>`;
                    });
                    topicDiv.appendChild(subtopicDiv);
                });
            }

            container.appendChild(topicDiv);
        });
    }

    // Smooth scroll to the right
    container.scrollTo({
        left: container.scrollWidth,
        behavior: 'smooth'
    });
}

// Fetch data and populate the HTML elements
fetchJSON().then(data => {
    populateTopics(data);
});
