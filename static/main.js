const outlets = document.querySelectorAll('.outlet');

// Communicate with API when controlling outlet
outlets.forEach(
  outlet => outlet.addEventListener('click', (e) => {
    const element = e.currentTarget;
    const dps = element.dataset.dps;
    const apiRequest = {
      dps: dps
    };

    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiRequest)
    })
    .then(response => response.json())
    .then(json => {
      if (json[dps]) {
        element.classList.add('on');
      } else {
        element.classList.remove('on');
      }
    })
    .catch(error => console.error('Error:', error));
  })
);
