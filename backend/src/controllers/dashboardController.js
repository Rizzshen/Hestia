import * as service from "../services/dashboardService.js";

export const getDashbaordMetrics = async(req, res) =>{
    try{
        const data = await service.getDashboardMetrics();
        res.status(201).json(data);
    }
    catch(err){
        res.status(500).json({error: err.message});
        
    }
}