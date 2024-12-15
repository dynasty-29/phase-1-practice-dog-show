document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
    const apiUrl = 'http://localhost:3000/dogs';
    
    // fetch
    fetchDogs();
    
    async function fetchDogs() {
        try {
            const response = await fetch(apiUrl);
            const dogs = await response.json();

            // Render each dog as a row in the table
            tableBody.innerHTML = ''; 
            dogs.forEach(dog => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${dog.name}</td>
                    <td>${dog.breed}</td>
                    <td>${dog.sex}</td>
                    <td><button class="edit-button" data-id="${dog.id}">Edit</button></td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners for the Edit buttons
            const editButtons = document.querySelectorAll('.edit-button');
            editButtons.forEach(button => {
                button.addEventListener('click', handleEditButtonClick);
            });
        } catch (error) {
            console.error('Error fetching dogs:', error);
        }
    }

    // Handle Edit button click - populate form with the dog's current info
    function handleEditButtonClick(event) {
        const dogId = event.target.getAttribute('data-id');
        
        // Fetch dog details by id
        fetch(`${apiUrl}/${dogId}`)
            .then(response => response.json())
            .then(dog => {
                // Populate the form with the dog's current information
                dogForm.name.value = dog.name;
                dogForm.breed.value = dog.breed;
                dogForm.sex.value = dog.sex;
                dogForm.setAttribute('data-id', dogId); 
            })
            .catch(error => console.error('Error fetching dog details:', error));
    }

    // Handle form submission to update dog info
    dogForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dogId = dogForm.getAttribute('data-id');
        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value
        };

        try {
            // Send PATCH request to update the dog's info
            await fetch(`${apiUrl}/${dogId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedDog)
            });

            // Re-fetch and re-render the dogs to show the updated information
            fetchDogs();

            // Clear the form fields after update
            dogForm.reset();
        } catch (error) {
            console.error('Error updating dog:', error);
        }
    });
});
