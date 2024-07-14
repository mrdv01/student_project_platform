function addTechnology() {
    const newTechnologyInput = document.getElementById('newTechnology');
    const technologyContainer = document.getElementById('technologies-container');

    if (newTechnologyInput.value.trim() !== '') {
        const technologyName = newTechnologyInput.value.trim();
        const checkboxId = technologyName.replace(/\s+/g, '-').toLowerCase();

        const div = document.createElement('div');
        div.classList.add('form-check', 'form-check-inline');
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" id="${checkboxId}" name="project[technologies]" value="${technologyName}" checked>
            <label class="form-check-label" for="${checkboxId}">${technologyName}</label>
        `;

        technologyContainer.appendChild(div);
        newTechnologyInput.value = ' ';
    }
}