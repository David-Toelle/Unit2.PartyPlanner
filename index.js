const state = {
  parties: [],
};

const fetchData = async () => {
  try {
    const response = await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2405-FTB-ET-WEB-FT/events`
    );
    const data = await response.json();
    state.parties = data.data;
    return state.parties;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    selectedPokemonContainer.textContent = "Pokemon not found";
  }
};
console.log(fetchData());

const render = async () => {
  const parties = await fetchData();

  if (!parties) return; // Exit if fetch failed

  console.log("THIS IS THE PARTIES DATA", parties);

  const ul = document.createElement("ul");
  ul.id = "party-list";

  parties.forEach((party) => {
    console.log("Party", party);

    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div>
        <h5>${party.name}</h5>
        <p>Date: ${party.date}, Time: ${party.time}</p>
        <p>Location: ${party.location}</p>
        <p>Description: ${party.description}</p>
      </div>
      <button class="btn btn-danger btn-sm" data-id="${party.id}">Delete</button>
    `;

    ul.appendChild(li);
  });

  const existingList = document.querySelector("#party-list");
  if (existingList) {
    existingList.replaceWith(ul);
  } else {
    document.body.appendChild(ul);
  }

  addDeleteEventListeners();
};

const addParty = async (event) => {
  event.preventDefault();

  const partyName = document.getElementById("partyName").value;
  const partyDate = document.getElementById("partyDate").value;
  const partyTime = document.getElementById("partyTime").value;
  const partyLocation = document.getElementById("partyLocation").value;
  const partyDescription = document.getElementById("partyDescription").value;

  // Arron told me to remove the time because it was not working and that fixing it was unnecessary
  const newParty = {
    name: partyName,
    description: partyDescription,
    date: "2024-10-10T14:00:00.000Z",
    location: partyLocation,
  };

  try {
    const response = await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2405-FTB-ET-WEB-FT/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParty),
      }
    );

    console.log("Response status: " + response.status);

    if (!response.ok) {
      const errorText = await response.text;
      console.log("Server error response", errorText);
      throw new Error("Failed to create new party");
    }

    const addedParty = await response.json();
    console.log("Party Added:", addedParty);

    // Re-render the party list to include the newly added party
    render();
  } catch (error) {
    console.error("Error adding party:", error);
  }
};

const removeParty = async (id) => {
  try {
    const deleteResponse = await fetch(
      `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2405-FTB-ET-WEB-FT/events/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!deleteResponse.ok) {
      throw new Error("Failed to delete party");
    }
    console.log(`Party with ID ${id} deleted`);
    render(); // Re-render the list after deletion
  } catch (error) {
    console.error("Error deleting party:", error);
  }
};

const addDeleteEventListeners = () => {
  document.querySelectorAll(".btn-danger").forEach((button) => {
    button.addEventListener("click", (event) => {
      const partyId = event.target.getAttribute("data-id");
      removeParty(partyId);
    });
  });
};

const main = (event) => {
  const addPartyButton = document.querySelector(".btn.btn-primary");
  addPartyButton.addEventListener("click", addParty);

  render();
};
document.addEventListener("DOMContentLoaded", main);
