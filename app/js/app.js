(function (window, document) {


	var logoutDisplayTimeout = null;
	var logoutTimeout = null;
	var logoutDisplayDelay = 30 * 6000;
	var logoutDelay = 2 * 6000;

	$(document).ready(function () {
		
		if (!$('section.directvalueterm').length) {
			return;
		}

		$('form [data-form-action=submit]').on('click', function () {
			$(this).parents('form').submit();
			return false;
		});

		$('form.buynow-form [data-form-action=accept], form.buynow-form [data-form-action=next]').on('click', function () {
			$(this).attr("disabled", "disabled");
			$('form.buynow-form').submit();
			return false;
		});
		
		$('form.buynow-form [data-form-action=prev]').on('click', function () {
			window.location = $(this).data('url');
			return false;
		});
		
		$('form.buynow-form [data-form-action=reject]').on('click', function () {
			displayDropoutModal();
			return false;
		});

		if ($('.slider-coverage').length) {
			var coverageSlider = $('.slider-coverage')[0];
			noUiSlider.create(coverageSlider, {
				start: $('input[name=sum_assured]').val() || 0,
				step: 100,
				connect: [true, false],
				padding: 100,
				tooltips: [
					wNumb({
						decimals: 0,
						prefix: 'S$',
						thousand: ','
					})
				],
				range: {
					min: $(coverageSlider).data('min') - 100,
					max: $(coverageSlider).data('max') + 100
				},
				pips: {
					mode: 'values',
					values: [$(coverageSlider).data('min'), $(coverageSlider).data('max')],
					density: 20,
					format: wNumb({
						decimals: 0,
						prefix: 'S$',
						thousand: ','
					})
				},
				format: wNumb({
					decimals: 0,
					prefix: '',
					thousand: ','
				})
			});
			coverageSlider.noUiSlider.on('update', function (values, handle) {
				$('input[name=sum_assured]').val(values[handle] || 0);
				$('input[name=rider_sum_assured]').val(values[handle] || 0);
			});
			
			$('input[name=sum_assured]').on('change', function () {
				coverageSlider.noUiSlider.set($(this).val() || 0);
			});
		}

		if ($('.slider-rider-coverage').length) {
			var riderCoverageSlider = $('.slider-rider-coverage')[0];
			noUiSlider.create(riderCoverageSlider, {
				start: $('input[name=rider_sum_assured]').val() || 0,
				step: 100,
				connect: [true, false],
				padding: 100,
				tooltips: [
					wNumb({
						decimals: 0,
						prefix: 'S$',
						thousand: ','
					})
				],
				range: {
					min: $(riderCoverageSlider).data('min') - 100,
					max: $(riderCoverageSlider).data('max') + 100
				},
				pips: {
					mode: 'values',
					values: [$(riderCoverageSlider).data('min'), $(riderCoverageSlider).data('max')],
					density: 20,
					format: wNumb({
						decimals: 0,
						prefix: 'S$',
						thousand: ','
					})
				},
				format: wNumb({
					decimals: 0,
					prefix: '',
					thousand: ','
				})
			});
			
			riderCoverageSlider.noUiSlider.on('update', function (values, handle) {
				$('input[name=rider_sum_assured]').val(values[handle] || 0);
			});
			
			$('input[name=rider_sum_assured]').on('change', function () {
				riderCoverageSlider.noUiSlider.set($(this).val() || 0);
			});
		}

		if ($('.directvalueterm__breadcrumb').data('otp-sent') == '0' && parseInt($('.directvalueterm__breadcrumb').data('max-step')) > 4 && parseInt($('.directvalueterm__breadcrumb').data('max-step')) <= 14) {
			$('#buynow-timeout-modal').on('hidden.bs.modal', resetLogoutTimeout);
			$('body').on('click', resetLogoutTimeout);
			$('body').keyup(resetLogoutTimeout);
			logoutDisplayTimeout = setTimeout(displayLogoutWarning, logoutDisplayDelay);
		}

		if ($('[data-current-step="3.0"]').length) step3();
		if ($('[data-current-step="4.0"]').length) step4();
		if ($('[data-current-step="4.1"]').length) step4a();
		if ($('[data-current-step="7.0"]').length) step7();
		if ($('[data-current-step="8.0"]').length) step8();
		if ($('[data-current-step="10.0"]').length) step10();
		if ($('[data-current-step="11.0"]').length) step11();
		if ($('[data-current-step="15.0"]').length) step15();

		if ($('form[data-form-dropout="1"]').length) {
			displayDropoutModal();
		}

		$('#buynow-dropout-modal .close').on('click', function () {
			location.href = '/yourdreams';
		});

		$('a[data-file-input]').on('click', function () {
			$('input#' + $(this).data('file-input')).on('click', );
			return false;
		});

		$('input[type=file]').on('change', function () {
			var filename = $(this).val().replace(/^.*[\\\/]/, '');
			$('a[data-file-input="' + $(this).attr('id') + '"]').text('File selected');
		});

		/**
		 * Tagging event functions
		 */
		var formStarted = false;
		$('[data-tag-quick-quote] input').add('[data-tag-quick-quote] select').on('change', function (e) {
			if (!formStarted) {
				trackingLibrary.toolInteractions({
					action: "Start",
					field: "Form Start",
					content: $(this).attr('name')
				});
				
				formStarted = true;
			}
		});
		
		$('[data-tag-quick-quote] a[data-action=quote]').on('focus', function (e) {
			trackingLibrary.toolInteractions({
				action: "Finish",
				field: "Form Finish",
				content: ""
			});
		});

		$('[data-tag-feedback-interaction]').on('click', function (e) {
			trackingLibrary.feedbackInteractions({
				isPositive: $(this).data('tagFeedbackInteraction')
			});
		});

	});

	function step3() {
		$('select[name="applicant_residency"]').on('change', function () {
			if ($(this).val() != '') {
				if ($(this).val() == 'Singaporean' || $(this).val() == 'Singapore PR') {
					$('[data-dynamic-label="applicant-nric-passport-label"]').text('NRIC');
				} else {
					$('[data-dynamic-label="applicant-nric-passport-label"]').text('passport');
				}
			}
		});
		
		$('select[name="insured_residency"]').on('change', function () {
			if ($(this).val() != '') {
				if ($(this).val() == 'Singaporean' || $(this).val() == 'Singapore PR') {
					$('[data-dynamic-label="insured-nric-passport-label"]').text('NRIC');
				} else {
					$('[data-dynamic-label="insured-nric-passport-label"]').text('passport');
				}
			}
		});
		
		$('input[name="life_insured"]').on('change', function () {
			$('[data-question-group=spouse]').toggle($(this).val() == 'spouse');
		});
		
		if ($('#id_insured_option2').is(':checked')) {
			$('[data-question-group=spouse]').show();
		}
		
		$('#buynow-dropout-modal .add1').show();
		$('select[name="applicant_residency"], select[name="insured_residency"]').on('change', );
	}

	function step4() {
		$('input[name="applicant_multiple_nationalities"]').on('change', function () {
			$('[data-question-group=multiple_nationalities]').toggle($(this).val() == 'Y');
		});
		
		if ($('#id_multiple_nationalities_option1').is(':checked')) {
			$('[data-question-group=multiple_nationalities]').show();
		}
		
		$('#buynow-dropout-modal .add1').show();
	}

	function step7() {
		$('input[name="include_ci_rider"]').on('change', function () {
			$('[data-question-group=ci_rider]').toggle($('input[name=include_ci_rider]').is(':checked'));
		});
		
		if ($('input[name=include_ci_rider]').is(':checked')) {
			$('[data-question-group=ci_rider]').show();
		}
	}

	function step8() {
		$('input[name="uw_lifestyle_questions_optin"]').on('change', function () {
			$('[data-question-group=uw_lifestyle]').toggle($(this).val() == 'Y');
		});
		
		if ($('#id_uw_lifestyle_questions_optin_option1').is(':checked')) {
			$('[data-question-group=uw_lifestyle]').show();
		}
	}

	function step10() {
		var workingStatus = ['Salaried', 'Self-employed'];
		var studentStatus = ['Student'];
		var employment = $('[name="applicant_employment"]');

		employment.on('change', function () {

			$('[data-question-group=working_applicant]').toggle(workingStatus.indexOf($(this).val()) != -1);
			$('[data-question-group=student_applicant]').toggle(studentStatus.indexOf($(this).val()) != -1);
			
			if (studentStatus.indexOf($(this).val()) != -1 && !$('[name="applicant_income"]').val()) {
				$('[name="applicant_income"]').val(0);
			}

			if ($(this).val() === 'Salaried') {
				$('[data-label-group="work-salaried"]').show();
				$('[data-label-group="work-self"]').hide();
			} else {
				$('[data-label-group="work-salaried"]').hide();
				$('[data-label-group="work-self"]').show();
			}
		});

		$('[data-question-group=working_applicant]').toggle(workingStatus.indexOf(employment.val()) != -1);
		$('[data-question-group=student_applicant]').toggle(studentStatus.indexOf(employment.val()) != -1);
	}

	function step11() {
		var totalMonths = -1;
		var years = parseInt($('input[name="applicant_address_period_stay_years"]').val());
		var months = parseInt($('input[name="applicant_address_period_stay_months"]').val());
		years = (isNaN(years) ? -1 : years);
		months = (isNaN(months) ? -1 : months);
		totalMonths = (years * 12) + months;
		
		if (totalMonths >= 0 && totalMonths < 60) {
			$('[data-question-group=address_less_than_5yrs]').show();
		}
		
		$('input[name="applicant_address_period_stay_years"], input[name="applicant_address_period_stay_months"]').on('change', function () {
			years = parseInt($('input[name="applicant_address_period_stay_years"]').val());
			months = parseInt($('input[name="applicant_address_period_stay_months"]').val());
			years = (isNaN(years) ? 0 : years);
			months = (isNaN(months) ? 0 : months);
			totalMonths = (years * 12) + months;
			$('[data-question-group=address_less_than_5yrs]').toggle(totalMonths < 60);
		});

		$('input[name="applicant_address_permanent"]').on('change', function () {
			$('[data-question-group=permanent_address]').toggle($(this).val() == 'N');
		});
		
		if ($('#id_applicant_address_permanent_option2').is(':checked')) {
			$('[data-question-group=permanent_address]').show();
		}

		var residentialAddressIsTaxCountry = false;
		$('.tax-country-wrapper').each(function () {
			if ($(this).find('select').val() != '' && $(this).find('select').val() != 'Singapore') {
				$(this).find('.tax-tin').show();
				if ($(this).find('.tax-tin [type=radio]:checked').val() == 'B') {
					$(this).find('.tax-tin .tax-tin-reason').show();
				}
			}
			if ($(this).find('select').val() == 'Singapore') {
				residentialAddressIsTaxCountry = true;
			}
		});
		
		$('[data-question-group=no_tax_country]').toggle(!residentialAddressIsTaxCountry);

		$('.tax-country select').on('change', function () {
			if ($(this).val() != '' && $(this).val() != 'Singapore') {
				$(this).parents('.tax-country-wrapper').find('.tax-tin').show();
			} else {
				$(this).parents('.tax-country-wrapper').find('.tax-tin').hide();
			}

			residentialAddressIsTaxCountry = false;
			$('.tax-country select').each(function (index, el) {
				if ($(el).val() == 'Singapore') {
					residentialAddressIsTaxCountry = true;
				}
			});
			$('[data-question-group=no_tax_country]').toggle(!residentialAddressIsTaxCountry);
		});
		$('.tax-tin [type=radio]').on('change', function () {
			if ($(this).val() == 'B') {
				$(this).parents('.tax-tin').find('.tax-tin-reason').show();
			} else {
				$(this).parents('.tax-tin').find('.tax-tin-reason').hide();
			}
		});

		$('input[name="applicant_bo"]').on('change', function () {
			$('[data-question-group=bo_details]').toggle($(this).val() == 'N');
		});
		
		if ($('#id_applicant_bo_option2').is(':checked')) {
			$('[data-question-group=bo_details]').show();
		}

		$('[name=applicant_address_registered]').on('change', function () {
			var isSameAddressAsNric = $('[name=applicant_address_registered]:checked').val() === 'Y';
			var $hiddenSection = $('[data-question-group=proof-of-address]');

			if (!isSameAddressAsNric) {
				$hiddenSection.show();
			} else {
				$hiddenSection.hide();
			}
		});
	}

	function step15() {
		$('input[name="feedback_recommend"]').on('change', function () {
			$('[data-question-group=feedback_norecommend]').toggle($(this).val() == 'N');
		});
		if ($('#id_feedback_recommend_option2').is(':checked')) {
			$('[data-question-group=feedback_norecommend]').show();
		}

		$('.rating span').on('click', function () {
			$(this).siblings().removeClass('hover');
			$(this).addClass('hover');
			$(this).parent().siblings('input[type=hidden]').val(5 - $(this).index());
		});
	}

	function resetLogoutTimeout() {
		clearTimeout(logoutDisplayTimeout);
		clearTimeout(logoutTimeout);
		logoutDisplayTimeout = setTimeout(displayLogoutWarning, logoutDisplayDelay);
	}

	function displayLogoutWarning() {
		clearTimeout(logoutDisplayTimeout);
		$('#buynow-timeout-modal').modal('show');
		logoutTimeout = setTimeout(function () {
			$.post('/ourplans/directvalueterm/dropout', function () {
				location.href = '/ourplans/directvalueterm';
			});
		}, logoutDelay);
	}

	function displayDropoutModal() {
		$('#buynow-dropout-modal').modal('show');
	}

}(window, document));
