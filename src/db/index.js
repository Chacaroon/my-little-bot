import mongoose from 'mongoose'

import {db} from '../constants'

mongoose.createConnection(db)