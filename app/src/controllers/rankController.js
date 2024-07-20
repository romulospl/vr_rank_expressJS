import rank from '../models/Rank.js'

class RankController {
    static async rank(request, response) {
        try {
            const resp = await rank.find({}).sort({ score: -1, createdAt: 1 });
            response.status(200).json(resp)
        } catch (error) {
            response.status(500).json({ message: error.message })
        }
    }

    static async newScore(request, response) {
        try {
            const currentDate = new Date();
            const adjustedDate = new Date(currentDate.getTime() - 3 * 60 * 60 * 1000);
            request.body.createdAt = adjustedDate
            console.log(request.body)
            const resp = await rank.create(request.body)
            response.status(201).json(resp)
        } catch (error) {
            response.status(500).json({ message: error.message })
        }
    }

    static async existByNickname(request, response) {
        try {
            const nickname = request.params.nickname
            const resp = await rank.findOne({ nickname });

            if (resp) {
                response.status(200).json(resp)
            } else {
                response.status(404).json({ message: "nickname not found" })
            }
        } catch (error) {
            response.status(500).json({ message: error.message })
        }
    }

    static async updateById(request, response) {
        try {
            const currentDate = new Date();
            const adjustedDate = new Date(currentDate.getTime() - 3 * 60 * 60 * 1000);
            request.body.createdAt = adjustedDate
            const body = request.body
            const id = request.params.id

            const resp = await rank.findByIdAndUpdate(id, body)

            response.status(200).json(resp)
        } catch (error) {
            response.status(500).json({ message: error.message })
        }
    }
}

export default RankController