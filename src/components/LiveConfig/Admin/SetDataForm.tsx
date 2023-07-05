import {
    TextField,
    Button,
    Box,
} from "@mui/material";
import React, { useState } from "react";
import { theme } from "../../../mui-theme";
import { useDispatch } from "react-redux";
import { setSets } from "../../../redux/data";

const emptySetData = {
    id: "",
    winnerName: "",
    winnerSeed: -1,
    winnerGames: -1,
    loserName: "",
    loserSeed: -1,
    loserGames: -1,
    roundName: "",
    phaseName: "",
    url: "",
    order: -1,
};

const SetDataForm = () => {
    const [formData, setFormData] = useState(emptySetData);

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.id;
        const value = event.target.value;
        setFormData(values => ({...values, [name]: value}));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setSets([formData]));
    };

    const generateRandomNumber = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const generateRandomString = (length: number): string => {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
      for (let i = 0; i < length; i++) {
        const randomIndex = generateRandomNumber(0, characters.length);
        result += characters.charAt(randomIndex);
      }
    
      return result;
    }

    const randomizeForm = () => {
        setFormData({
            id: generateRandomNumber(1, 1000000).toString(),
            winnerName: generateRandomString(5),
            winnerSeed: generateRandomNumber(1, 100),
            winnerGames: generateRandomNumber(2,4),
            loserName: generateRandomString(5),
            loserSeed: generateRandomNumber(1,100),
            loserGames: generateRandomNumber(0,2),
            roundName: generateRandomString(5),
            phaseName: generateRandomString(5),
            url: "",
            order: generateRandomNumber(1, 100000000000),
        })
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <form
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "start",
                    gap: theme.spacing(1),
                    marginTop: theme.spacing(3),
                    marginBottom: theme.spacing(5),
                }}
                onSubmit={handleSubmit}
            >
                <TextField sx={{ flexBasis: "45%" }} id="id" label="id" value={formData.id} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "45%" }} id="order" label="order" value={formData.order} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="winnerName" label="winnerName" value={formData.winnerName} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="winnerSeed" label="winnerSeed" value={formData.winnerSeed} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="winnerGames" label="winnerGames" value={formData.winnerGames} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="loserName" label="loserName" value={formData.loserName} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="loserSeed" label="loserSeed" value={formData.loserSeed} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="loserGames" label="loserGames" value={formData.loserGames} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="phaseName" label="phaseName" value={formData.phaseName} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="roundName" label="roundName" value={formData.roundName} onChange={handleChange}/>
                <TextField sx={{ flexBasis: "30%" }} id="url" label="url" value={formData.url} onChange={handleChange}/>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        randomizeForm();
                    }}
                    sx={{
                        height: "7rem",
                        width: "13rem",
                    }}
                >
                    Randomize
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                        height: "7rem",
                        width: "13rem",
                    }}
                >
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default SetDataForm;
