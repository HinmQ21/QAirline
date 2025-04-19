import React from "react";
import "./MainContent.css";

function MainContent() {
    return (
        <div className="main-content">
            <div className="content">
                <div className="main-leftcontent">
                    {/* destination icon */}
                    {/* badge */}
                    {/* heading */}
                    {/* destination */}
                    {/* bookingform */}
                    <div className="main-booking">
                        {/* flightOption */}
                        <div className="flight-options">
                            <input
                                type="radio"
                                id="roundtrip"
                                className="custom-radio"
                                style={{
                                    marginRight: "5px",
                                    marginBottom: "5px",
                                    cursor: "pointer",
                                  }}

                            />
                            <label className="radio-label" for="roundtrip"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: "35px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    color: "white",
                                  }}
                            >Round Trip</label>

                            <input
                                type="radio"
                                id="oneway"
                                className="custom-radio"
                                style={{
                                    marginRight: "5px",
                                    marginBottom: "5px",
                                    cursor: "pointer",
                                  }}

                            />
                            <label className="radio-label" for="oneway"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: "35px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    color: "white",
                                }}
                            >One Way</label>
                            
                        </div>  

                        <div className="booking-container">
                            {/* flightdetails */}
                            <div className="flight-details">
                                {/* startDate */}
                                <div className="flight-search-bar">
                                    <div className="input-group">
                                        {/* icon */}
                                        <div 
                                            style={{
                                                outline: "solid 1px black",
                                                width: "20px",
                                                height: "20px",
                                                
                                            }}
                                        ></div>

                                        {/* search */}
                                        <div>
                                            <input
                                                type="text" 
                                                placeholder="Start Destination"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    border: "none",
                                                    
                                                }}
                    
                                            />

                                        </div>  
                                    </div>

                                    {/* Datepicker */}
                                    <div
                                        style={{
                                            width: "40%",
                                            border: "solid 1px #ccc",
                                            borderTopRightRadius: "10px",
                                            borderBottomRightRadius: "10px",
                                            
                                            
                                        }}
                                    >
                                        <input
                                            type="text"                    
                                            placeholder="Start Date"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                border: "none",
                                                
                                            }}
                                        />

                                    </div>


                                </div>
                                {/* endDate */}
                                <div className="flight-search-bar">

                                </div>                                   
                                {/* person */}
                            </div>
    
                            {/* searchbut */}
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default MainContent;