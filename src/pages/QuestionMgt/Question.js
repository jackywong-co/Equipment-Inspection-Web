// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import eyeOffFIll from '@iconify/icons-eva/eye-off-fill';
import eyeFIll from '@iconify/icons-eva/eye-fill';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, TextField, Box, CssBaseline
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import Page from 'src/components/Page';
// api
import { getQuestions, checkQuestion, activeQuestion, disableQuestion, createQuestion, updateQuestion, deleteQuestion } from 'src/services/question.context';
import Label from 'src/components/Label';
import EnhancedTableHead from 'src/components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from 'src/components/EnchancedToolbar';
import SearchNotFound from 'src/components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function Question() {

  const [questionList, setQuestionList] = useState([]);

  const loadQuestionList = async () => {
    await getQuestions()
      .then((response) => {
        setQuestionList(response.data);
      });
  }

  useEffect(() => {
    loadQuestionList();
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('question_text');

  const TABLE_HEAD = [
    { id: 'question_text', label: 'Question', alignRight: false },
    { id: 'is_active', label: 'Status', alignRight: false },
    { id: '' }
  ];

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (question) => question.question_text.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  // toolbar
  const [filterName, setFilterName] = useState('');
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const filteredUsers = applySortFilter(questionList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  // TablePagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questionList.length) : 0;
  // more menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleElClick = (inputFormId, event) => {
    const obj = {
      inputFormId,
      element: event.currentTarget
    };
    setAnchorEl(obj);
    checkStatus(inputFormId)
  };
  const handleElClose = () => {
    setAnchorEl(null);
  };

  // check question is active
  const [questionStatus, setQuestionStatus] = useState();
  const checkStatus = (id) => {
    checkQuestion(id)
      .then((response) => {
        setQuestionStatus(response.data.is_active)
      })
  }
  // active question
  const handleActiveQuestion = async (id) => {
    await activeQuestion(id)
    await loadQuestionList()
    handleElClose();
  }

  // disable question
  const handleDisableQuestion = async (id) => {
    await disableQuestion(id)
    await loadQuestionList()
    handleElClose();
  };

  // add question
  const [addOpen, setAddOpen] = useState(false);
  const handleAddClick = () => {
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  // add question form 
  const validationSchema = yup.object({
    question_text: yup
      .string('Enter Question')
      .required('Question Name is required'),
  });

  const formik = useFormik({
    initialValues: {
      question_text: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in questionList) {
        let questionTextList = questionList[x].question_text
        if (values.question_text === questionTextList) {
          setErrors({ question_text: 'Question in used' });
          resetControl = false;
        }
      }
      if (resetControl) {
        const question_text = values.question_text;
        await createQuestion(question_text);
        await loadQuestionList();
        resetForm();
        handleAddClose();
      }
    },
  });

  // edit room
  const [editQuestion, setEditQuestion] = useState({
    id: '',
    question_text: '',
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClick = (id) => {
    for (let x in questionList) {
      if (id === questionList[x].id) {
        let question_text = questionList[x].question_text;
        setEditQuestion({
          id: id,
          question_text: question_text,
        });
      }
    }
    setEditOpen(true);
    handleElClose();
  }
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const editValidationSchema = yup.object({
    question_text: yup
      .string('Enter Question')
      .required('Question is required'),
  });

  // edit room form
  const editUserFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      question_text: editQuestion.question_text,
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in questionList) {
        let questionTextList = questionList[x].question_text
        if (values.question_text === questionTextList) {
          if (values.question_text !== questionTextList) {
            setErrors({ question_text: 'Question in used' });
            resetControl = false;
          }
        }
      }
      if (resetControl) {
        const id = editQuestion.id;
        const question_text = values.question_text;
        await updateQuestion(id, question_text);
        await loadQuestionList();
        resetForm();
        handleEditClose();
      }
    },
  });
  const handleDeleteQuestion = async (id) => {
    await deleteQuestion(id);
    await loadQuestionList();
  }
  return (
    <Page title="Question">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Question
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<Icon icon={plusFill} />}
          >
            New Question
          </Button>
        </Stack>
        {/* main */}
        <Card>
          {/* Toolbar */}
          <EnchancedToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          {/* table */}
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              {/* table head */}
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={questionList.length}
                onRequestSort={handleRequestSort}
              />
              {/* table body */}
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={5}>
                          <Typography variant="subtitle2" noWrap >
                            {row.question_text}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">
                        <Label
                          variant="ghost"
                          color={row.is_active ? 'success' : 'error'}
                        >
                          {row.is_active ? 'Active' : 'Disabled'}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label='more'
                          aria-controls="long-menu"
                          aria-expanded={anchorEl != null && anchorEl.inputFormId === row.id ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={(e) => handleElClick(row.id, e)}
                        >
                          <Icon icon={moreVerticalFill} width={20} height={20} />
                        </IconButton>
                        {/* more menu */}
                        <Menu
                          id={row.id}
                          anchorEl={anchorEl != null && anchorEl.element}
                          open={anchorEl != null && anchorEl.inputFormId === row.id}
                          onClose={handleElClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}

                        >
                          {questionStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableQuestion(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeOffFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveQuestion(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Active" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                          }
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleEditClick(row.id) }}>
                            <ListItemIcon>
                              <Icon icon={editFill} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem>
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDeleteQuestion(row.id) }}>
                            <ListItemIcon>
                              <Icon icon={trash2Outline} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                {/* TablePagination */}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            {/* TablePagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={questionList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
        {/* add dialoag form */}
        <Dialog open={addOpen} onClose={handleAddClose}>

          {/* add room form */}
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Create Question
              </Typography>
              <form onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }} style={{
                    width: 400,
                  }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="question_text"
                  label="Question Name"
                  name="question_text"
                  autoComplete="question_text"
                  value={formik.values.question_text}
                  onChange={formik.handleChange}
                  error={formik.touched.question_text && Boolean(formik.errors.question_text)}
                  helperText={formik.touched.question_text && formik.errors.question_text}
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Container>
        </Dialog>
      </Container>

      <Dialog open={editOpen} onClose={handleEditClose}>

        {/* edit user form */}
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Edit Form
            </Typography>
            <form onSubmit={editUserFormik.handleSubmit} noValidate sx={{ mt: 1 }} style={{
                    width: 400,
                  }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="question_text"
                label="Question Name"
                name="question_text"
                autoComplete="question_text"
                value={editUserFormik.values.question_text}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.question_text && Boolean(editUserFormik.errors.question_text)}
                helperText={editUserFormik.touched.question_text && editUserFormik.errors.question_text}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={editUserFormik.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Box>
        </Container>
      </Dialog>
    </Page>
  );
}