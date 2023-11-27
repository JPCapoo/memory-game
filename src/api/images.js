import axios from 'axios';

export async function fetchImages() {
    const response = await axios.get('https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20');

    if (!response.data) {
        return null;
    }

    return response.data;
}

