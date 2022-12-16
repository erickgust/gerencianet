import { Router } from 'express'
import PlanController from './controllers/PlanController'

const router = Router()

router.get('/plans', PlanController.getPlans)
router.post('/createSubscription', PlanController.createSubscriptionBolix)

export default router
