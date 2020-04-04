const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const { isAuthenticated} = require('../helpers/auth');

router.get('/cuentas/add', isAuthenticated, (req, res) => {
 res.render('cuentas/new-cuentas');
});

router.post('/cuentas/new-cuentas', isAuthenticated, async (req, res) => {
 const { NumCuenta, nombreCli, banco, saldo, description}=req.body;
 const errors = [];
 if(!NumCuenta){
   errors.push({text: 'El campo no debe estar vacío, debes escribir un numero de cuenta'});
 }
 if(!nombreCli){
   errors.push({text: 'El campo no debe estar vacío, debes escribir el nombre del cliente'});
 }
 if(!banco){
   errors.push({text: 'El campo no debe estar vacío, debes escribir un banco'});
 }
 if(!saldo){
   errors.push({text: 'El campo no debe estar vacío, debes escribir el saldo'});
 }
 if(!description){
   errors.push({text: 'El campo no debe estar vacío, debes escribir una descripción'});
 }
 if(errors.length > 0) {
   res.render('cuentas/new-cuentas', {
     errors,
     NumCuenta,
     nombreCli,
     banco,
     saldo,
     description
   });
 } else {
  const newNote = new Note({ NumCuenta, nombreCli, banco, saldo, description });
  await newNote.save();
  req.flash('success_msg', 'Cuenta agregada correctamente');
  res.redirect('/cuentas');
 }
});

router.get('/cuentas', isAuthenticated,async (req, res) => {
  const notes = await Note.find();
  res.render('cuentas/all-cuentas', { notes });
});

router.get('/cuentas/edit/:id', isAuthenticated, async (req, res) => {
   const note = await Note.findById(req.params.id);
  res.render('cuentas/edit-cuentas', {note});
});

router.put('/cuentas/edit-cuentas/:id',isAuthenticated, async (req, res) => {
  const {NumCuenta, nombreCli, banco, saldo, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, {NumCuenta, nombreCli, banco, saldo, description});
  req.flash('success_msg', 'Cuenta editada correctamente');
  res.redirect('/cuentas');
});

router.delete('/cuentas/delete/:id', isAuthenticated, async (req, res) => {
 await Note.findByIdAndDelete(req.params.id);
 req.flash('success_msg', 'Cuenta eliminada correctamente');
 res.redirect('/cuentas');
});

module.exports = router;