import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Details from './Details';

function TaskList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [sortField, setSortField] = useState('userId');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => response.json())
            .then(data => setTasks(data))
    }, []);

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toString().includes(searchQuery) ||
        task.userId.toString().includes(searchQuery) ||
        task.completed.toString().includes(searchQuery)
    );

    const sortedTasks = filteredTasks.slice().sort((a, b) => {
        if (sortDirection === 'asc') {
            if (a[sortField] < b[sortField]) return -1;
            if (a[sortField] > b[sortField]) return 1;
            return 0;
        } else {
            if (a[sortField] > b[sortField]) return -1;
            if (a[sortField] < b[sortField]) return 1;
            return 0;
        }
    });

    const handleSortClick = field => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const [userId, setUserId] = useState();
    const [todoDetails, setTodoDetails] = useState();

    return (
        <>
            <div class="row m-0 p-0">
                <div class="col-8">
                    <div style={{ backgroundColor: "red", display: "inline" }}>
                        <br />
                        <input
                            className='form-control'
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={event => setSearchQuery(event.target.value)}
                        />
                        <br />
                        <Table className="table table-bordered table-dark">
                            <thead style={{ cursor: "pointer" }}>
                                <tr>
                                    <th onClick={() => handleSortClick('id')}>
                                        ID
                                        {sortField === 'id' ? (
                                            <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                        ) : null}
                                    </th>
                                    <th onClick={() => handleSortClick('userId')}>
                                        User ID
                                        {sortField === 'userId' ? (
                                            <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                        ) : null}
                                    </th>
                                    <th onClick={() => handleSortClick('title')}>
                                        Title
                                        {sortField === 'title' ? (
                                            <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                        ) : null}
                                    </th>
                                    <th onClick={() => handleSortClick('completed')}>
                                        Completed
                                        {sortField === 'completed' ? (
                                            <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                        ) : null}
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTasks.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.userId}</td>
                                        <td>{task.title}</td>
                                        <td>{task.completed ? 'Yes' : 'No'}</td>
                                        <td>
                                            <Button onClick={
                                                () => {
                                                    setTodoDetails(task);
                                                    setUserId(task.userId);
                                                }
                                            }>
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div class="col-4">
                    <Details todoDetails={todoDetails} userId={userId} />
                </div>
            </div>
        </>
    );
}

export default TaskList;
