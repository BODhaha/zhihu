const Answer = require('../models/answers');

class AnswersCtl {
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    let { page = 1 } = ctx.query;
    page = Math.max(1, page * 1) - 1;
    const perPage = Math.max(1, per_page * 1);
    const q = new RegExp(ctx.query.q);
    ctx.body = await Answer
      .find({ content: q, questionId: ctx.params.questionId })
      .limit(perPage)
      .skip(page * perPage);
  }

  async checkAnswerExist(ctx, next) {
    const id = ctx.params.id
    const answer = await Answer.findById(id).select('+answerer');
    if (!answer) { ctx.throw(404, '答案不存在') };
    if (answer.questionId !== ctx.params.questionId) {
      ctx.throw(404, '该问题下没有此答案');
    }
    ctx.state.answer = answer;
    await next();
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query;
    const selectFields = fields.split(';').filter(f =>  f).map(f => ' +' + f).join('');
    const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer');
    ctx.body = answer;
  }

  async create(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    });
    const answerer = ctx.state.user._id;
    const questionId = ctx.params.questionId;
    const answer = await new Answer({ ...ctx.request.body, answerer, questionId }).save();
    ctx.body = answer;
  }

  async checkAnswerer(ctx, next) {
    const { answerer } = ctx.state.answer;
    if (answerer.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限');
    }
    await next();
  }

  async update(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false },
    });
    await ctx.state.answer.update(ctx.request.body);
    ctx.body = ctx.state.answer;
  }

  async delete(ctx) {
    await Answer.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new AnswersCtl()