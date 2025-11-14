"use client";
import { useAuth } from "@/lib/AuthContext";
import React from "react";

const Test = () => {
    const { user } = useAuth();

    const fetchHealthCheck = async () => {
        if (!user) {
            console.log("No user yet");
            return null;
        }
        const idToken = await user.getIdToken();
        console.log("ID Token in Test page:", idToken);

        try {
            const response = await fetch("http://localhost:3005/test", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            const fastifyresponse = await fetch("http://localhost:8001/test", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            const honoresponse = await fetch("http://localhost:3010/test", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching health check:", error);
            return null;
        }
    };

    React.useEffect(() => {
        fetchHealthCheck().then((data) => {
            if (data) {
                console.log("Health check data from product-service:", data);
            }
        });
    }, [user]); // run when user changes

    return <div>Test</div>;
};

export default Test;
