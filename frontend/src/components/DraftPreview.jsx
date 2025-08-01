import { Box, Typography, Link as MuiLink, Stack } from "@mui/material";
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import LinkIcon from '@mui/icons-material/Link';

// Универсальная функция для рендера списков с поддержкой HTML
function renderList(items, level = 0) {
    if (!Array.isArray(items)) return null;

    return (
        <Box component="ul" sx={{ pl: 2 + level * 2, mb: 1 }}>
            {items.map((item, i) => {
                // Если строка — применяем innerHTML (поддержка тегов)
                if (typeof item === "string") {
                    return (
                        <li key={i}>
                            <Typography
                                variant="body1"
                                component="span"
                                sx={{ display: 'inline' }}
                                dangerouslySetInnerHTML={{ __html: item }}
                            />
                        </li>
                    );
                }
                // Если объект — возможно, вложенный список
                if (typeof item === "object" && item !== null) {
                    return (
                        <li key={i}>
                            <Typography
                                variant="body1"
                                component="span"
                                dangerouslySetInnerHTML={{
                                    __html: item.content && typeof item.content === 'string' ? item.content : JSON.stringify(item)
                                }}
                            />
                            {Array.isArray(item.items) && item.items.length > 0 && renderList(item.items, level + 1)}
                        </li>
                    );
                }
                return null;
            })}
        </Box>
    );
}

const DraftPreview = ({ draft }) => {
    if (!draft?.content?.blocks) return null;

    return (
        <Stack spacing={2}>
            {draft.content.blocks.map((block, idx) => {
                if (block.type === "header") {
                    return (
                        <Typography
                            key={idx}
                            variant={`h${block.data.level || 2}`}
                            fontWeight={700}
                            sx={{ mt: idx === 0 ? 0 : 1 }}
                            // поддержка жирного, курсива и т.д.
                            dangerouslySetInnerHTML={{ __html: block.data.text }}
                        />
                    );
                }
                if (block.type === "paragraph") {
                    return (
                        <Typography
                            key={idx}
                            variant="body1"
                            dangerouslySetInnerHTML={{ __html: block.data.text }}
                        />
                    );
                }
                if (block.type === "list") {
                    return (
                        <Box key={idx}>
                            {renderList(block.data.items)}
                        </Box>
                    );
                }
                if (block.type === "image") {
                    return (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                my: 2
                            }}
                        >
                            <Box
                                sx={{
                                    width: 140,
                                    height: 100,
                                    bgcolor: 'background.paper',
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 2,
                                    mb: 1
                                }}
                            >
                                <InsertPhotoOutlinedIcon sx={{ fontSize: 48, color: 'primary.light', opacity: 0.75 }} />
                            </Box>
                        </Box>
                    );
                }
                if (block.type === "linkTool" || block.type === "link") {
                    const url = block.data?.link || block.data?.url || "https://localhost:5173";
                    const text = block.data?.meta?.title || block.data?.text || url;
                    return (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                my: 2,
                                width: '100%',
                                flexDirection: 'column',
                            }}
                        >
                            <LinkIcon color="primary" sx={{ fontSize: 28, opacity: 0.75 }} />
                            <MuiLink
                                href={url}
                                target="_blank"
                                rel="noopener"
                                color="primary"
                                underline="hover"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: 16,
                                    maxWidth: 360,
                                    textAlign: 'center',
                                    overflowWrap: 'anywhere'
                                }}
                                dangerouslySetInnerHTML={{ __html: text }}
                            />
                        </Box>
                    );
                }
                // Неизвестный блок — не рендерим
                return null;
            })}
        </Stack>
    );
};

export default DraftPreview;
