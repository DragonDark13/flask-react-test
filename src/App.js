import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState([]);
    const [itemEdit, setItemEdit] = useState(null); // Додали стан для зберігання стану" +
    const [loading, setLoading] = useState(true); // Додали стан для зберігання стану завантаження

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        age: '',
        id: ''
    });


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [editableItemData, setEditableItemData] = useState({
        name: '',
        lastname: '',
        age: '',
    });

    const handleChangeEditableItem = (e) => {
        const {name, value} = e.target;
        setEditableItemData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/save_data', formData);
            console.log('Data saved successfully!');
            // Очищення форми після успішного збереження
            setFormData({
                name: '',
                lastname: '',
                age: '',
                id: ''
            });

            await fetchData();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    useEffect(() => {

        console.log(data);
        if (data.length === 0) {
            fetchData();
        }
    }, [data]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/get_data');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Після завершення завантаження встановлюємо стан завантаження в false
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Покажемо загрузку, якщо дані ще не завантажені
    }

    const deleteUser = async (userId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/delete_user/${userId}`);
            console.log(response.data.message); // Виведення повідомлення про успішне видалення
            // Тут ви можете оновити інтерфейс або виконати інші дії
            await fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            // Обробка помилки, якщо видалення не вдалося
        }
    };

    function saveItem(id) {
        setItemEdit(null)
        console.log(editableItemData);

        axios.post('http://localhost:5000/save_item', {
            id: id,
            name: editableItemData.name,
            lastname: editableItemData.lastname,
            age: editableItemData.age
        })
            .then(function (response) {
                console.log(response.data); // Виводимо повідомлення про успішне оновлення в консоль

                 fetchData();
            })
            .catch(function (error) {
                console.error('Error:', error);

            }).finally(function () {
            setEditableItemData({
                name: '',
                lastname: '',
                age: '',
            })
        });

    }

    return (
        <div>
            <h1>Data from Flask:</h1>
            <ul>
                {data.map(item => (
                    <li key={item.name}>
                        {itemEdit !== item.id ? <p> {item.name} {item.lastname} - {item.age} - {item.id}</p>
                            :
                            <div>
                                <label>Name:</label>
                                <input type="text" name="name" value={editableItemData.name}
                                       onChange={handleChangeEditableItem}/>
                                <br/>
                                <label>Lastname:</label>
                                <input type="text" name="lastname" value={editableItemData.lastname}
                                       onChange={handleChangeEditableItem}/>
                                <br/>
                                <label>Age:</label>
                                <input type="number" name="age" value={editableItemData.age}
                                       onChange={handleChangeEditableItem}/>
                                <br/>
                                <button onClick={() => saveItem(item.id)}>Save Item</button>
                            </div>

                        }

                        <button disabled={itemEdit !== null} onClick={() => {
                            setItemEdit(item.id)
                            setEditableItemData({age: item.age, lastname: item.lastname, name: item.name})
                        }}>edit
                        </button>
                        <button disabled={itemEdit !== null} onClick={() => deleteUser(item.id)}>delete</button>
                    </li>
                ))}
            </ul>

            <div>
                <h1>Enter Data:</h1>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                    <br/>
                    <label>Lastname:</label>
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange}/>
                    <br/>
                    <label>Age:</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange}/>
                    <br/>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
}

export default App;
