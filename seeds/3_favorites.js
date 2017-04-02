
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('favorites').del()
    .then(function () {
      return knex('favorites').insert(
        [{
    id: 1,
    book_id: 1,
    user_id: 1,
    created_at: new Date('2016-06-29 14:26:16 UTC'),
    updated_at: new Date('2016-06-29 14:26:16 UTC')
  }]
      );
    }).then(() =>{
      return knex.raw("select setval('favorites_id_seq', (select max(id) from favorites));")
    });

};
