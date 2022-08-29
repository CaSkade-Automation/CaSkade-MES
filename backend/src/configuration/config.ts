export default ():BackendConfig => {
    const config = process.env.configuration;
    switch (config) {
    case "production":
        return {
            graphDbUrl: "http://graphdb:7200",
            mtp2SkillApiUrl: "http://mtp2skill:8080",
            plc2SkillApiUrl: "http://plc2skill:8080"
        };

    case "development":
    default:
        return {
            graphDbUrl: "http://localhost:7200",
            mtp2SkillApiUrl: "http://localhost:1234",
            plc2SkillApiUrl: "http://localhost:1234"
        };

        break;
    }

};

interface BackendConfig {
    graphDbUrl: string,
    mtp2SkillApiUrl: string,
    plc2SkillApiUrl: string;
}
