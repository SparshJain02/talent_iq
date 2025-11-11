export const getDifficultyBageClass =(difficulty) =>{
    switch(difficulty.toLowerCase()){
        case "easy":
            return "badge-success";
        case "medium":
            return "badge-warning";
        case "hard":
            return "badge-danger";
        default:
            return "badge-ghost";
    }
}