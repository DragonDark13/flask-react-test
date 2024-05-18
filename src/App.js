import React, {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState([]);
    const [itemEdit, setItemEdit] = useState(null); // Додали стан для зберігання стану" +
    const [loading, setLoading] = useState(true); // Додали стан для зберігання стану завантаження

    const [princes, setPrinces] = useState([]);
    const [selectedPrince, setSelectedPrince] = useState({
        name: '',
        id: ''
    });

    const [formData, setFormData] = useState({
        prince_id: '',
        lastname: '',
        age: '',
        id: ''
    });


    const handleChange = (e) => {
        const {name, value} = e.target;

        const newValue = name === 'age' || name === 'prince_id' ? Number(value) : value;

        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    const [editableItemData, setEditableItemData] = useState({
        name: '',
        lastname: '',
        age: '',
    });

    const handleChangeEditableItem = (e) => {
        const {name, value} = e.target;
        const newValue = name === 'age' || name === 'prince_id' ? parseInt(value, 10) : value;
        setEditableItemData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // setFormData(prevState => {
        //     const selectedPrince = princes.find(prince => prince.id === formData.prince_id);
        //     return {
        //         ...prevState,
        //         name: selectedPrince ? selectedPrince.name : '' // Якщо обраний князь існує, встановіть його ім'я, інакше встановіть порожню рядок
        //     };
        // });

        try {


            await axios.post('http://localhost:5000/save_data', formData);
            console.log('Data saved successfully!');
            // Очищення форми після успішного збереження
            setFormData({
                lastname: '',
                prince_id: '',
                age: '',
                id: ''
            });

            await fetchData();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    useEffect(() => {


        fetchData();

        console.log(data);

    }, []);

    useEffect(() => {


        fetch('http://localhost:5000/api/kyivan_princes')
            .then(response => response.json())
            .then(data => setPrinces(data))
            .catch(error => console.error('Error fetching data:', error));

        console.log("princes", princes);


    }, []);

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
            name: selectedPrince.name,
            prince_id: selectedPrince.id,
            lastname: editableItemData.lastname,
            age: editableItemData.age
        })
            .then(function (response) {
                console.log(response.data); // Виводимо повідомлення про успішне оновлення в консоль
                setData([])
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
            setSelectedPrince('')
        });

    }


    const handleChangePrince = (event) => {
        setSelectedPrince({
            id: event.target.value,
            name: princes.find(prince => prince.id === selectedPrince.id),
        });
    };

    return (
        <div>
            <h1>Data from Flask:</h1>
            <ul>
                {data.length > 0 && data.map(item => (
                    <li key={item.name}>
                        {itemEdit !== item.id ? <p> {item.name} {item.lastname} - {item.age} - {item.id}</p>
                            :
                            <div>
                                <h1>Список Київських князів</h1>
                                <select value={selectedPrince} onChange={handleChangePrince}>
                                    <option value="">Оберіть князя</option>
                                    {princes.map((prince, index) => (
                                        <option key={prince.id} value={prince.name}>{prince.name}</option>
                                    ))}
                                </select>
                                <label>Name:</label>
                                <input type="text" name="name" value={editableItemData.name}
                                       onChange={handleChangeEditableItem}/>
                                <br/>
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
                            setSelectedPrince({name: item.name, id: item.prince_id})
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
                    {selectedPrince.name && <p>Ви обрали: {selectedPrince.name}</p>}
                    <label>Name:</label>
                    <select name="prince_id" value={selectedPrince} onChange={handleChange}>
                        <option value="">Оберіть князя</option>
                        {princes.map((prince, index) => (
                            <option key={prince.id} value={prince.id}>{prince.name}</option>
                        ))}
                    </select>
                    <br/>
                    <label>Lastname:</label>
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange}/>
                    <br/>
                    <label>Age:</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange}/>
                    <br/>
                    <button onClick={handleSubmit} >Save</button>
                </form>
            </div>
        </div>
    );
}

export default App;
