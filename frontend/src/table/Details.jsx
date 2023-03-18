import React, { useState, useEffect } from "react";
import axios from "axios";

const Details = (props) => {
    const userId = props.userId;

    const [user, setUser] = useState(null);

    useEffect(() => {
        axios
            .get(`https://jsonplaceholder.typicode.com/users/${userId}`)
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [userId]);

    if (!user) {
        return <div className="sticky-top" style={{color:"#a5a5a5", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#e5e5e5"}}>Select Any Todo to view Details</div>;
    }

    return (
        <div className="card sticky-top rounded-0" style={{fontSize:"0.9em"}}>
            <div className="card-header">
                <h5>User Details</h5>
            </div>
            <div className="card-body">
                {/* company */}
                <div className="row">
                    <div className="col-sm-12"><b>Todo Details</b></div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Todo ID:</div>
                    <div className="col-sm-8">{props.todoDetails.id}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Todo Title:</div>
                    <div className="col-sm-8">{props.todoDetails.title}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Completed:</div>
                    <div className="col-sm-8">{props.todoDetails.completed?"YES":"NO"}</div>
                </div>
                <hr />
                {/* company end */}
                <div className="row">
                    <div className="col-sm-4">User Id:</div>
                    <div className="col-sm-8">{userId}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Name:</div>
                    <div className="col-sm-8">{user.name}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">UserName:</div>
                    <div className="col-sm-8">{user.username}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Email:</div>
                    <div className="col-sm-8">{user.email}</div>
                </div>


                {/* address */}
                <hr />
                <div className="row">
                    <div className="col-sm-12"><b>ADDRESS</b></div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Street:</div>
                    <div className="col-sm-8">{user.address.street}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Suite:</div>
                    <div className="col-sm-8">{user.address.suite}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">City:</div>
                    <div className="col-sm-8">{user.address.city}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Phone:</div>
                    <div className="col-sm-8">{user.phone}</div>
                </div>
                <hr />
                {/* address end */}


                {/* company */}
                <div className="row">
                    <div className="col-sm-12"><b>Company</b></div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Website:</div>
                    <div className="col-sm-8">{user.website}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Name:</div>
                    <div className="col-sm-8">{user.company.name}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Catch Phrase:</div>
                    <div className="col-sm-8">{user.company.catchPhrase}</div>
                </div>
                <div className="row">
                    <div className="col-sm-4">Work:</div>
                    <div className="col-sm-8">{user.company.bs}</div>
                </div>
                {/* company end */}
            </div>
        </div>
    );
};

export default Details;
