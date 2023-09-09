export async function LoadJson(path){
    const response = await fetch(path);
    if (!response.ok) {
        console.error("Failed to load json from path " + path);
        return null;
    }
    
    return await response.json();
}