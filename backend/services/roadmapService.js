export function generateRoadmap(rankedSkills) {
    return rankedSkills.map((skill) => ({
        ...skill,
        status: "Not Started"
    }));
}