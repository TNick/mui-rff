import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { KeyboardDatePicker } from '../src';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { act, customRender } from '../src/test/TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date;
}

describe('KeyboardDatePicker', () => {
	const defaultDateValue = '2019-10-18';
	const defaultDateString = `${defaultDateValue}T00:00:00`;

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function KeyboardDatePickerComponent({ initialValues, validator }: ComponentProps) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		const validate = async (values: FormData) => {
			if (validator) {
				return validator(values);
			}
		};

		return (
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				validate={validate}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit} noValidate>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<KeyboardDatePicker label="Test" name="date" required={true} inputFormat="yyyy-MM-dd" />
						</LocalizationProvider>
					</form>
				)}
			/>
		);
	}

	const originalWarn = console.warn.bind(this);
	beforeAll(() => {
		console.warn = (msg) => !msg.toString().includes('KeyboardDatePicker is deprecated') && originalWarn(msg);
	});

	afterAll(() => {
		console.warn = originalWarn;
	});

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateValue)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateValue);
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = customRender(<KeyboardDatePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});
});
