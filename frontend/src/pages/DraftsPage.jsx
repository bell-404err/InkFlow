import React, { useEffect, useState } from "react";
import { getDrafts, deleteDraft } from "../helpers/draftStorage";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Paper, Stack, IconButton, Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DraftsPage() {
    const [drafts, setDrafts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setDrafts(getDrafts());
    }, []);

    const handleDelete = (id) => {
        deleteDraft(id);
        setDrafts(getDrafts());
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", py: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                Draft
            </Typography>
            {drafts.length === 0 ? (
                <Typography color="text.secondary">You don't have draft yet.</Typography>
            ) : (
                <Stack spacing={2}>
                    {drafts.map(draft => (
                        <Paper
                            key={draft.id}
                            sx={{
                                p: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Box>
                                <Typography variant="h6">{draft.title || "Без названия"}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {draft.updatedAt
                                        ? new Date(draft.updatedAt).toLocaleString()
                                        : ""}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/createpost/draft/${draft.id}`)}
                                >
                                    Продолжить
                                </Button>
                                <IconButton onClick={() => handleDelete(draft.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            )}
        </Box>
    );
}
